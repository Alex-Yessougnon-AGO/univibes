import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdDto, UpdateAdDto } from './dto/create-ad.dto';

@Injectable()
export class AdsService {
  private readonly logger = new Logger(AdsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findActive(city?: string) {
    const now = new Date();
    const where: any = {
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
    };

    if (city) where.targetCity = city;

    return this.prisma.ad.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  async findAll() {
    return this.prisma.ad.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id } });
    if (!ad) {
      throw new NotFoundException({
        code: 'AD_NOT_FOUND',
        message: 'Publicit\u00e9 introuvable.',
      });
    }
    return ad;
  }

  async create(dto: CreateAdDto) {
    const ad = await this.prisma.ad.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });

    this.logger.log(`Publicité créée: ${ad.advertiserName}`);
    return ad;
  }

  async update(id: string, dto: UpdateAdDto) {
    const ad = await this.prisma.ad.findUnique({ where: { id } });
    if (!ad) {
      throw new NotFoundException({
        code: 'AD_NOT_FOUND',
        message: 'Publicité introuvable.',
      });
    }

    return this.prisma.ad.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async delete(id: string) {
    const ad = await this.prisma.ad.findUnique({ where: { id } });
    if (!ad) {
      throw new NotFoundException({
        code: 'AD_NOT_FOUND',
        message: 'Publicité introuvable.',
      });
    }

    await this.prisma.ad.delete({ where: { id } });
  }
}
