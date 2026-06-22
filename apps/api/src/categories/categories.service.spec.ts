import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

const mockPrisma = {
  eventCategory: { findMany: jest.fn<any, any>(), findUnique: jest.fn<any, any>() },
};

const mockCacheService = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn(),
  del: jest.fn(),
  delPattern: jest.fn(),
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return categories with event counts', async () => {
      mockPrisma.eventCategory.findMany.mockResolvedValue([{ id: 'c1', name: 'Concert', _count: { events: 5 } }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]._count.events).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should return category with approved events', async () => {
      mockPrisma.eventCategory.findUnique.mockResolvedValue({ id: 'c1', name: 'Concert', events: [] });
      const result = await service.findOne('c1');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Concert');
    });
  });
});
