import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  favorite: { findMany: jest.fn<any, any>(), findUnique: jest.fn<any, any>(), create: jest.fn<any, any>(), delete: jest.fn<any, any>() },
  event: { findUnique: jest.fn<any, any>() },
};

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return user favorites', async () => {
      mockPrisma.favorite.findMany.mockResolvedValue([{ id: 'f1', event: { title: 'Event' } }]);
      const result = await service.findAll('user-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('add', () => {
    it('should add favorite', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ id: 'event-1' });
      mockPrisma.favorite.findUnique.mockResolvedValue(null);
      mockPrisma.favorite.create.mockResolvedValue({ id: 'f1' });
      const result = await service.add('user-1', 'event-1');
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if already favorited', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({ id: 'event-1' });
      mockPrisma.favorite.findUnique.mockResolvedValue({ id: 'f1' });
      await expect(service.add('user-1', 'event-1')).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException for non-existent event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);
      await expect(service.add('user-1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove favorite', async () => {
      mockPrisma.favorite.delete.mockResolvedValue({});
      await service.remove('user-1', 'event-1');
      expect(mockPrisma.favorite.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException if favorite not found', async () => {
      mockPrisma.favorite.delete.mockRejectedValue(new Error());
      await expect(service.remove('user-1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });
});
