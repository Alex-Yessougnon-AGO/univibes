import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { CreateOrganizerDto, UpdateOrganizerDto } from './dto/create-organizer.dto';

@Injectable()
export class OrganizersService {
  private readonly logger = new Logger(OrganizersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(userId: string, dto: CreateOrganizerDto) {
    const existing = await this.prisma.organizer.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new ConflictException({
        code: 'ALREADY_ORGANIZER',
        message: 'Vous êtes déjà organisateur.',
      });
    }

    const organizer = await this.prisma.organizer.create({
      data: {
        userId,
        ...dto,
      },
      include: { user: { select: { email: true, profile: true } } },
    });

    // Mettre à jour le rôle de l'utilisateur
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'organizer' },
    });

    this.logger.log(`Nouvel organisateur: ${organizer.organizationName}`);
    await this.audit.log({
      actorId: userId,
      action: 'ORGANIZER_CREATED',
      entityType: 'organizer',
      entityId: organizer.id,
    });

    return organizer;
  }

  async findById(id: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id },
      include: {
        user: { select: { profile: true } },
        events: {
          where: { status: 'approved' },
          orderBy: { startDate: 'desc' },
          take: 20,
          include: { category: true, _count: { select: { favorites: true } } },
        },
        _count: { select: { events: true, boosts: true } },
      },
    });

    if (!organizer) {
      throw new NotFoundException({
        code: 'ORGANIZER_NOT_FOUND',
        message: 'Organisateur introuvable.',
      });
    }

    return organizer;
  }

  async getMyOrganizer(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
          include: {
            category: true,
            _count: { select: { favorites: true, orders: true } },
          },
        },
        boosts: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!organizer) {
      throw new NotFoundException({
        code: 'NOT_ORGANIZER',
        message: "Vous n'êtes pas encore organisateur.",
      });
    }

    return organizer;
  }

  async update(userId: string, dto: UpdateOrganizerDto) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
    });

    if (!organizer) {
      throw new NotFoundException({
        code: 'NOT_ORGANIZER',
        message: "Vous n'êtes pas encore organisateur.",
      });
    }

    const updated = await this.prisma.organizer.update({
      where: { userId },
      data: dto,
    });

    this.logger.log(`Organisateur mis à jour: ${userId}`);
    await this.audit.log({
      actorId: userId,
      action: 'ORGANIZER_UPDATED',
      entityType: 'organizer',
      entityId: updated.id,
    });

    return updated;
  }

  async getDashboard(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
    });

    if (!organizer) {
      throw new NotFoundException({
        code: 'NOT_ORGANIZER',
        message: "Vous n'êtes pas organisateur.",
      });
    }

    const now = new Date();
    const [
      totalEvents,
      upcomingEvents,
      totalViews,
      totalOrders,
      recentOrders,
    ] = await Promise.all([
      this.prisma.event.count({ where: { organizerId: organizer.id } }),
      this.prisma.event.count({
        where: { organizerId: organizer.id, startDate: { gte: now } },
      }),
      this.prisma.event.aggregate({
        where: { organizerId: organizer.id },
        _sum: { views: true },
      }),
      this.prisma.order.count({
        where: { event: { organizerId: organizer.id }, status: 'paid' },
      }),
      this.prisma.order.findMany({
        where: { event: { organizerId: organizer.id } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { profile: true } },
          event: { select: { title: true } },
        },
      }),
    ]);

    return {
      stats: {
        totalEvents,
        upcomingEvents,
        totalViews: totalViews._sum.views ?? 0,
        totalOrders,
      },
      recentOrders,
    };
  }
}
