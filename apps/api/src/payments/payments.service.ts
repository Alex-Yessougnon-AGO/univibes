import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { FedaPayService } from './fedapay.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly fedapay: FedaPayService,
    private readonly config: ConfigService,
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

    const statusMap: Record<string, any> = {
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

        // Générer les tickets
        const order = await tx.order.findUnique({
          where: { id: payment.orderId },
          include: {
            items: true,
            user: true,
            event: { select: { title: true } },
          },
        });

        if (order) {
          this.logger.log(`Paiement confirmé pour commande ${order.id}`);
        }
      }
    });

    await this.audit.log({
      actorId: '',
      action: 'PAYMENT_WEBHOOK',
      entityType: 'payment',
      entityId: payment.id,
      metadata: { provider: dto.provider, status: newStatus },
    });
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
