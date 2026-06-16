import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoostDto } from './dto/create-boost.dto';

@Injectable()
export class BoostsService {
  private readonly logger = new Logger(BoostsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBoostDto) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
    });

    if (!organizer) {
      throw new NotFoundException({
        code: 'NOT_ORGANIZER',
        message: 'Vous devez être organisateur.',
      });
    }

    const event = await this.prisma.event.findFirst({
      where: { id: dto.eventId, organizerId: organizer.id },
    });

    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable ou ne vous appartient pas.',
      });
    }

    const durationMap: Record<string, number> = {
      h24: 24,
      h72: 72,
      days7: 168,
    };

    const hours = durationMap[dto.boostType];
    if (!hours) {
      throw new BadRequestException({
        code: 'INVALID_BOOST_TYPE',
        message: 'Type de boost invalide.',
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);

    const boost = await this.prisma.boost.create({
      data: {
        eventId: dto.eventId,
        organizerId: organizer.id,
        boostType: dto.boostType as any,
        startDate,
        endDate,
      },
    });

    this.logger.log(`Boost créé: ${boost.id} pour ${dto.eventId}`);
    return boost;
  }

  async findByUser(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
    });

    if (!organizer) return [];

    return this.prisma.boost.findMany({
      where: { organizerId: organizer.id },
      orderBy: { createdAt: 'desc' },
      include: { event: { select: { title: true, slug: true } } },
    });
  }
}
