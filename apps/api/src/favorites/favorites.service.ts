import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          include: {
            category: true,
            organizer: { include: { user: { select: { profile: true } } } },
            _count: { select: { favorites: true } },
          },
        },
      },
    });
  }

  async add(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) {
      throw new ConflictException({
        code: 'ALREADY_FAVORITE',
        message: 'Cet événement est déjà dans vos favoris.',
      });
    }

    const favorite = await this.prisma.favorite.create({
      data: { userId, eventId },
      include: { event: true },
    });

    this.logger.log(`Favori ajouté: ${userId} → ${eventId}`);
    return favorite;
  }

  async remove(userId: string, eventId: string) {
    try {
      await this.prisma.favorite.delete({
        where: { userId_eventId: { userId, eventId } },
      });
    } catch {
      throw new NotFoundException({
        code: 'FAVORITE_NOT_FOUND',
        message: 'Favori introuvable.',
      });
    }
  }
}
