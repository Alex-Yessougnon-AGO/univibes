import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async findAll() {
    const cacheKey = 'categories:all';
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const categories = await this.prisma.eventCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { events: true } } },
    });

    await this.cache.set(cacheKey, categories, 300); // 5 min — les catégories changent rarement
    return categories;
  }

  async findOne(id: string) {
    return this.prisma.eventCategory.findUnique({
      where: { id },
      include: { events: { where: { status: 'approved' }, take: 20 } },
    });
  }
}
