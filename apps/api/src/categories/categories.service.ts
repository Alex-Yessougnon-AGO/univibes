import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.eventCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { events: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.eventCategory.findUnique({
      where: { id },
      include: { events: { where: { status: 'approved' }, take: 20 } },
    });
  }
}
