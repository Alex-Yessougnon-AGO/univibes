import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { CacheService } from '../cache/cache.service';
import { CreateEventDto, UpdateEventDto, QueryEventsDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly cache: CacheService,
  ) {}

  async create(userId: string, dto: CreateEventDto) {
    const organizer = await this.prisma.organizer.findUnique({ where: { userId } });
    if (!organizer) {
      throw new ForbiddenException({
        code: 'NOT_ORGANIZER',
        message: 'Vous devez être organisateur pour créer un événement.',
      });
    }

    // Invalider le cache des événements
    await this.cache.delPattern('events:*');

    const baseSlug = slugify(dto.title, { lower: true, strict: true });
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const event = await this.prisma.event.create({
      data: {
        organizerId: organizer.id,
        categoryId: dto.categoryId,
        title: dto.title,
        slug: uniqueSlug,
        description: dto.description,
        coverImage: dto.coverImage,
        location: dto.location,
        city: dto.city,
        latitude: dto.latitude,
        longitude: dto.longitude,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isFree: dto.isFree ?? false,
      },
      include: { category: true, organizer: { include: { user: { select: { profile: true } } } } },
    });

    this.logger.log(`Événement créé: ${event.title}`);
    await this.audit.log({
      actorId: userId,
      action: 'EVENT_CREATED',
      entityType: 'event',
      entityId: event.id,
    });

    return event;
  }

  async findAll(query: QueryEventsDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);

    // Cache key basé sur les filtres (pas la page 1 seulement)
    const cacheKey = `events:findAll:${JSON.stringify(query)}`;
    if (page <= 3) {
      const cached = await this.cache.get<any>(cacheKey);
      if (cached) return cached;
    }
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) where.status = query.status;
    else where.status = 'approved';

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: {
          category: true,
          organizer: { include: { user: { select: { profile: true } } } },
          _count: { select: { favorites: true, tickets: true } },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    const result = {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1,
      },
    };

    // Cache les premières pages (30s TTL)
    if (page <= 3) {
      await this.cache.set(cacheKey, result, 30);
    }

    return result;
  }

  async findOne(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        organizer: {
          include: { user: { select: { profile: true } } },
        },
        tickets: { orderBy: { price: 'asc' } },
        _count: { select: { favorites: true, orders: true } },
      },
    });

    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    // Incrémenter les vues
    await this.prisma.event.update({
      where: { id: event.id },
      data: { views: { increment: 1 } },
    });

    return { ...event, views: event.views + 1 };
  }

  async findByOrganizer(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({ where: { userId } });
    if (!organizer) return [];

    return this.prisma.event.findMany({
      where: { organizerId: organizer.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        _count: { select: { favorites: true, orders: true } },
      },
    });
  }

  async update(userId: string, eventId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    await this.checkOwnership(userId, event.organizerId);

    const updated = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: { category: true },
    });

    // Invalider le cache
    await this.cache.delPattern('events:*');

    this.logger.log(`Événement mis à jour: ${updated.title}`);
    await this.audit.log({
      actorId: userId,
      action: 'EVENT_UPDATED',
      entityType: 'event',
      entityId: eventId,
    });

    return updated;
  }

  async delete(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    await this.checkOwnership(userId, event.organizerId);

    await this.prisma.event.delete({ where: { id: eventId } });

    // Invalider le cache
    await this.cache.delPattern('events:*');

    this.logger.log(`Événement supprimé: ${event.title}`);
    await this.audit.log({
      actorId: userId,
      action: 'EVENT_DELETED',
      entityType: 'event',
      entityId: eventId,
    });
  }

  async getCities() {
    const cacheKey = 'events:cities';
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const cities = await this.prisma.event.groupBy({
      by: ['city'],
      where: { status: 'approved' },
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
    });

    const result = cities.map((c) => ({
      city: c.city,
      count: c._count.city,
    }));

    await this.cache.set(cacheKey, result, 120);
    return result;
  }

  async searchSuggestions(query: string) {
    if (!query || query.length < 2) {
      return { suggestions: { titles: [], cities: [] } };
    }

    const [titles, cities] = await Promise.all([
      this.prisma.event.findMany({
        where: {
          status: 'approved',
          title: { contains: query, mode: 'insensitive' },
        },
        select: { title: true, slug: true },
        take: 5,
        orderBy: { views: 'desc' },
      }),
      this.prisma.event.findMany({
        where: {
          status: 'approved',
          city: { contains: query, mode: 'insensitive' },
        },
        select: { city: true },
        distinct: ['city'],
        take: 5,
      }),
    ]);

    return {
      suggestions: {
        titles: titles.map((t) => ({ text: t.title, slug: t.slug })),
        cities: [...new Set(cities.map((c) => c.city))],
      },
    };
  }

  private async checkOwnership(userId: string, organizerId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const organizer = await this.prisma.organizer.findUnique({ where: { userId } });

    if (user?.role !== 'admin' && (!organizer || organizer.id !== organizerId)) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: "Vous n'avez pas les droits pour modifier cet événement.",
      });
    }
  }
}
