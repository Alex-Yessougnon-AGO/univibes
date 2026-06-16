import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/initiate-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
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

    // TODO: Intégration réelle avec FedaPay/Kkiapay
    // Ici on simule un redirect URL
    const paymentUrl = `${process.env.APP_URL}/checkout/${order.eventId}?paymentId=${payment.id}`;

    return {
      paymentId: payment.id,
      amount: order.amount,
      provider: dto.provider,
      paymentUrl,
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
