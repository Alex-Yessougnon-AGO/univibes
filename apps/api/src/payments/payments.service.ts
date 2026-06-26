import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { FedaPayService } from './fedapay.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/initiate-payment.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly fedapay: FedaPayService,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async initiate(userId: string, dto: InitiatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Commande introuvable.',
      });
    }

    if (order.status !== 'pending') {
      throw new BadRequestException({
        code: 'ORDER_ALREADY_PAID',
        message: 'Cette commande a déjà été payée ou annulée.',
      });
    }

    // Vérifier que le provider est supporté
    if (!['fedapay', 'kkiapay'].includes(dto.provider)) {
      throw new BadRequestException({
        code: 'INVALID_PROVIDER',
        message: 'Moyen de paiement non supporté.',
      });
    }

    // Créer le paiement
    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        provider: dto.provider,
        amount: order.amount,
      },
    });

    this.logger.log(`Paiement initié: ${payment.id} via ${dto.provider}`);

    if (dto.provider === 'fedapay') {
      try {
        const callbackUrl = dto.successUrl ?? `${this.config.get('APP_URL')}/checkout/success`;
        const result = await this.fedapay.createTransaction({
          amount: Number(order.amount),
          description: `Commande ${order.id}`,
          callbackUrl,
        });

        // Mettre à jour avec la référence FedaPay
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { providerReference: result.id },
        });

        return {
          paymentId: payment.id,
          amount: order.amount,
          provider: dto.provider,
          paymentUrl: result.url,
          simulated: result.simulated,
        };
      } catch (error) {
        this.logger.error(`Échec FedaPay: ${(error as Error).message}`);
        // Fallback: URL simulée
        const fallbackUrl = `${this.config.get('APP_URL', 'http://localhost:3001')}/checkout/${order.eventId}?paymentId=${payment.id}`;
        return {
          paymentId: payment.id,
          amount: order.amount,
          provider: dto.provider,
          paymentUrl: fallbackUrl,
          simulated: true,
        };
      }
    }

    // Kkiapay ou fallback simulé
    const paymentUrl = `${this.config.get('APP_URL', 'http://localhost:3001')}/checkout/${order.eventId}?paymentId=${payment.id}`;

    return {
      paymentId: payment.id,
      amount: order.amount,
      provider: dto.provider,
      paymentUrl,
      simulated: dto.provider !== 'fedapay',
    };
  }

  async handleWebhook(dto: PaymentWebhookDto) {
    this.logger.log(`Webhook reçu: ${dto.provider} → ${dto.providerReference} → ${dto.status}`);

    // Trouver le paiement par provider reference
    const payment = await this.prisma.payment.findFirst({
      where: {
        provider: dto.provider,
        providerReference: dto.providerReference,
      },
    });

    if (!payment) {
      this.logger.warn(`Webhook pour paiement inconnu: ${dto.providerReference}`);
      return;
    }

    // Idempotency: un paiement déjà cloturé en success est ignoré (FedaPay
    // renvoie parfois le webhook plusieurs fois). On évite ainsi de régénérer
    // des billets en double.
    if (payment.status === 'success') {
      this.logger.log(`Paiement ${payment.id} déjà traité — webhook ignoré (idempotent)`);
      return;
    }

    const statusMap: Record<string, 'success' | 'failed'> = {
      success: 'success',
      approved: 'success',
      completed: 'success',
      failed: 'failed',
      cancelled: 'failed',
    };

    const newStatus = statusMap[dto.status] ?? 'failed';

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          providerReference: dto.providerReference,
          webhookReceivedAt: new Date(),
        },
      });

      if (newStatus === 'success') {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'paid' },
        });
      }
    });

    await this.audit.log({
      actorId: '',
      action: 'PAYMENT_WEBHOOK',
      entityType: 'payment',
      entityId: payment.id,
      metadata: { provider: dto.provider, status: newStatus },
    });

    // Hors transaction : génération des billets + notification utilisateur.
    // On reste idempotent : issueTickets ne crée rien si les billets existent déjà.
    if (newStatus === 'success') {
      try {
        await this.fulfillOrder(payment.orderId);
      } catch (err) {
        // On ne fait pas échouer le webhook (réponse 2xx à FedaPay) : le statut
        // commande/paiement est déjà cohérent, on log pour investigation.
        this.logger.error(
          `Échec fulfillment commande ${payment.orderId}: ${(err as Error).message}`,
        );
      }
    }
  }

  /**
   * Fulfillment post-paiement : génère les billets (idempotent) puis notifie
   * l'utilisateur en base. Idempotent grâce à issueTickets qui vérifie les
   * billets existants.
   */
  private async fulfillOrder(orderId: string) {
    const existing = await this.prisma.issuedTicket.findFirst({
      where: { orderId },
      select: { id: true },
    });
    if (existing) {
      this.logger.log(`Commande ${orderId} déjà fulfill — skip`);
      return;
    }

    const issued = await this.ordersService.issueTickets(orderId);

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { event: { select: { title: true } } },
    });

    if (order) {
      this.logger.log(
        `${issued.length} billet(s) émis pour la commande ${orderId} (${order.event.title})`,
      );

      // Notification temps-réel + persistée
      await this.notificationsService.create(
        order.userId,
        'payment_success',
        'Paiement confirmé 🎉',
        `Votre paiement pour « ${order.event.title} » a été confirmé. ${issued.length} billet(s) disponible(s).`,
        { orderId, ticketsCount: issued.length },
      );
    }
  }

  async getPaymentStatus(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Aucun paiement trouvé pour cette commande.',
      });
    }

    return payment;
  }
}
