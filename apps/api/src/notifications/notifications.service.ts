import { Injectable, NotFoundException, Optional, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    // Optionnel pour casser une éventuelle circularité au bootstrap.
    @Optional() @Inject(forwardRef(() => WebsocketsGateway))
    private readonly ws?: WebsocketsGateway,
  ) {}

  async findAll(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };
    if (unreadOnly) where.read = false;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { data: notifications, total };
  }

  async unreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  }

  async markRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException({
        code: 'NOTIFICATION_NOT_FOUND',
        message: 'Notification introuvable.',
      });
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async create(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ) {
    const notification = await this.prisma.notification.create({
      data: { userId, type, title, body, data: (data ?? {}) as any },
    });

    // Temps réel : pousse sur la socket de l'utilisateur si connecté.
    this.ws?.emitToUser(userId, 'notification', notification);

    return notification;
  }
}
