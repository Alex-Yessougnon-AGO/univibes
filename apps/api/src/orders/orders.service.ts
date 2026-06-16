import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { title: true, slug: true, coverImage: true, startDate: true } },
        items: { include: { ticket: { select: { name: true } } } },
        payment: true,
      },
    });
  }

  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: {
          include: {
            organizer: { include: { user: { select: { profile: true } } } },
          },
        },
        items: {
          include: {
            ticket: true,
            issuedTickets: true,
          },
        },
        payment: true,
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Commande introuvable.',
      });
    }

    return order;
  }

  async create(userId: string, dto: CreateOrderDto) {
    // Vérifier que l'événement existe
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      include: { tickets: true },
    });

    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    if (event.status !== 'approved') {
      throw new BadRequestException({
        code: 'EVENT_NOT_AVAILABLE',
        message: 'Cet événement n\'est pas disponible à la réservation.',
      });
    }

    // Vérifier les stocks
    let totalAmount = 0;
    const orderItems: { ticketId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of dto.items) {
      const ticket = event.tickets.find((t) => t.id === item.ticketId);
      if (!ticket) {
        throw new NotFoundException({
          code: 'TICKET_NOT_FOUND',
          message: `Billet ${item.ticketId} introuvable.`,
        });
      }

      if (ticket.remaining < item.quantity) {
        throw new BadRequestException({
          code: 'INSUFFICIENT_STOCK',
          message: `Stock insuffisant pour "${ticket.name}". Il reste ${ticket.remaining} place(s).`,
        });
      }

      totalAmount += Number(ticket.price) * item.quantity;
      orderItems.push({
        ticketId: ticket.id,
        quantity: item.quantity,
        unitPrice: Number(ticket.price),
      });
    }

    // Créer la commande avec les items
    const order = await this.prisma.$transaction(async (tx) => {
      // Décrémenter les stocks
      for (const item of orderItems) {
        await tx.ticket.update({
          where: { id: item.ticketId },
          data: { remaining: { decrement: item.quantity } },
        });
      }

      const created = await tx.order.create({
        data: {
          userId,
          eventId: dto.eventId,
          amount: totalAmount,
          items: {
            create: orderItems.map((item) => ({
              ticketId: item.ticketId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          items: true,
          event: { select: { title: true } },
        },
      });

      return created;
    });

    this.logger.log(`Commande créée: ${order.id} — ${order.event.title}`);
    await this.audit.log({
      actorId: userId,
      action: 'ORDER_CREATED',
      entityType: 'order',
      entityId: order.id,
      metadata: { amount: totalAmount, items: orderItems.length },
    });

    return order;
  }

  async issueTickets(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });

    if (!order) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Commande introuvable.',
      });
    }

    const issuedTickets = [];

    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i++) {
        const qrCode = this.generateQrCode(order.id, item.ticketId, i);
        const issued = await this.prisma.issuedTicket.create({
          data: {
            orderId: order.id,
            orderItemId: item.id,
            userId: order.userId,
            ticketId: item.ticketId,
            qrCode,
          },
        });
        issuedTickets.push(issued);
      }
    }

    return issuedTickets;
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException({
        code: 'ORDER_NOT_FOUND',
        message: 'Commande introuvable.',
      });
    }

    if (order.status !== 'pending') {
      throw new BadRequestException({
        code: 'CANNOT_CANCEL',
        message: 'Cette commande ne peut plus être annulée.',
      });
    }

    await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.ticket.update({
          where: { id: item.ticketId },
          data: { remaining: { increment: item.quantity } },
        });
      }
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      });
    });

    await this.audit.log({
      actorId: userId,
      action: 'ORDER_CANCELLED',
      entityType: 'order',
      entityId: orderId,
    });
  }

  private generateQrCode(orderId: string, ticketId: string, index: number): string {
    const payload = `${orderId}:${ticketId}:${index}:${Date.now()}`;
    const secret = process.env.QR_CODE_SECRET ?? 'qr-secret';
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return `UV-${hash.substring(0, 16).toUpperCase()}`;
  }
}
