import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly cache: CacheService,
  ) {}

  async getDashboard() {
    const [
      totalUsers,
      totalEvents,
      totalApprovedEvents,
      totalPendingEvents,
      totalOrganizers,
      totalOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.event.count(),
      this.prisma.event.count({ where: { status: 'approved' } }),
      this.prisma.event.count({ where: { status: 'pending' } }),
      this.prisma.organizer.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true },
      }),
    ]);

    const recentEvents = await this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        organizer: { include: { user: { select: { profile: true } } } },
        category: true,
      },
    });

    return {
      stats: {
        totalUsers,
        totalEvents,
        totalApprovedEvents,
        totalPendingEvents,
        totalOrganizers,
        totalOrders,
        totalRevenue: totalRevenue._sum.amount ?? 0,
      },
      recentEvents,
    };
  }

  async getUsers(page: number = 1, limit: number = 20) {
    const safeLimit = Math.min(limit, 100);
    const skip = (page - 1) * safeLimit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        include: { profile: true, _count: { select: { orders: true } } },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: { total, page, limit: safeLimit, totalPages: Math.ceil(total / safeLimit) },
    };
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        organizer: {
          include: { events: { take: 20, orderBy: { createdAt: 'desc' } } },
        },
        orders: { take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { favorites: true, notifications: true } },
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }

    return user;
  }

  async updateUserRole(id: string, role: 'student' | 'organizer' | 'moderator' | 'admin') {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }

  async toggleUserStatus(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true },
    });
  }

  async getEvents(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        organizer: { include: { user: { select: { profile: true } } } },
        category: true,
        _count: { select: { orders: true, favorites: true } },
      },
    });
  }

  async getPendingEvents() {
    return this.prisma.event.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
      take: 100,
      include: {
        organizer: { include: { user: { select: { profile: true } } } },
        category: true,
      },
    });
  }

  async approveEvent(eventId: string, adminId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: { status: 'approved' },
    });

    // Invalider le cache des événements
    await this.cache.delPattern('events:*');

    this.logger.log(`Événement approuvé: ${event.title}`);
    await this.audit.log({
      actorId: adminId,
      action: 'EVENT_APPROVED',
      entityType: 'event',
      entityId: eventId,
    });

    return updated;
  }

  async rejectEvent(eventId: string, adminId: string, reason?: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: { status: 'rejected' },
    });

    // Invalider le cache des événements
    await this.cache.delPattern('events:*');

    this.logger.log(`Événement refusé: ${event.title}`);
    await this.audit.log({
      actorId: adminId,
      action: 'EVENT_REJECTED',
      entityType: 'event',
      entityId: eventId,
      metadata: { reason },
    });

    return updated;
  }

  async getOrganizers() {
    return this.prisma.organizer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { email: true, profile: true } },
        _count: { select: { events: true, boosts: true } },
      },
    });
  }

  async verifyOrganizer(organizerId: string, adminId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new NotFoundException({
        code: 'ORGANIZER_NOT_FOUND',
        message: 'Organisateur introuvable.',
      });
    }

    const updated = await this.prisma.organizer.update({
      where: { id: organizerId },
      data: { verified: !organizer.verified },
    });

    this.logger.log(
      `Organisateur ${updated.verified ? 'vérifié' : 'dé-vérifié'}: ${organizerId}`,
    );
    await this.audit.log({
      actorId: adminId,
      action: 'ORGANIZER_VERIFIED',
      entityType: 'organizer',
      entityId: organizerId,
      metadata: { verified: updated.verified },
    });

    return updated;
  }

  async getTransactions() {
    return this.prisma.payment.findMany({
      where: { status: { not: 'pending' } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        order: {
          include: {
            user: { select: { profile: true } },
            event: { select: { title: true } },
          },
        },
      },
    });
  }

  async getBoosts() {
    return this.prisma.boost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        event: { select: { title: true, slug: true } },
        organizer: { select: { organizationName: true } },
      },
    });
  }

  async getUniversities() {
    const profiles = await this.prisma.profile.findMany({
      where: { university: { not: null } },
      select: { university: true, city: true },
      distinct: ['university'],
    });

    const universities = profiles.map((p) => ({
      id: p.university?.toLowerCase().replace(/\s+/g, '-') ?? '',
      name: p.university,
      city: p.city ?? '—',
      students: 0,
    }));

    // Get student counts per university
    const counts = await this.prisma.profile.groupBy({
      by: ['university'],
      _count: { university: true },
      where: { university: { not: null } },
    });

    return universities.map((u) => ({
      ...u,
      students:
        counts.find((c) => c.university === u.name)?._count.university ?? 0,
    }));
  }

  private readonly defaultSettings: Record<string, string> = {
    commission: '5',
    maxEventsPerOrg: '50',
    requireVerification: 'true',
    maintenance: 'false',
  };

  async getSettings() {
    const rows = await this.prisma.platformSetting.findMany();
    const settings: Record<string, any> = {};
    for (const [key, defaultValue] of Object.entries(this.defaultSettings)) {
      const row = rows.find((r) => r.key === key);
      const rawValue = row?.value ?? defaultValue;
      // Convertir les booléens et nombres
      if (rawValue === 'true' || rawValue === 'false') {
        settings[key] = rawValue === 'true';
      } else if (!isNaN(Number(rawValue))) {
        settings[key] = Number(rawValue);
      } else {
        settings[key] = rawValue;
      }
    }
    return settings;
  }

  async updateSettings(newSettings: Record<string, any>) {
    const upserts = Object.entries(newSettings).map(([key, value]) =>
      this.prisma.platformSetting.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      }),
    );
    await Promise.all(upserts);
    this.logger.log('Paramètres plateforme mis à jour en base');
    return this.getSettings();
  }

  async getAuditLogs(limit: number = 50) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
      include: {
        actor: { select: { email: true, profile: { select: { fullname: true } } } },
      },
    });
  }
}
