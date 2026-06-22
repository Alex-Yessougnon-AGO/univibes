import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdsService } from './ads.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  ad: { findMany: jest.fn<any, any>(), findUnique: jest.fn<any, any>(), create: jest.fn<any, any>(), update: jest.fn<any, any>(), delete: jest.fn<any, any>() },
};

describe('AdsService', () => {
  let service: AdsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<AdsService>(AdsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findActive', () => {
    it('should return active ads', async () => {
      mockPrisma.ad.findMany.mockResolvedValue([{ id: 'a1', advertiserName: 'Shop' }]);
      const result = await service.findActive();
      expect(result).toHaveLength(1);
    });

    it('should filter by city', async () => {
      mockPrisma.ad.findMany.mockResolvedValue([]);
      await service.findActive('Cotonou');
      expect(mockPrisma.ad.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ targetCity: 'Cotonou' }) }),
      );
    });
  });

  describe('create', () => {
    it('should create ad', async () => {
      mockPrisma.ad.create.mockResolvedValue({ id: 'a1', advertiserName: 'Shop', startDate: new Date(), endDate: new Date() });
      const result = await service.create({ advertiserName: 'Shop', bannerUrl: 'https://example.com/banner.jpg', startDate: '2026-01-01', endDate: '2026-12-31' });
      expect(result.advertiserName).toBe('Shop');
    });
  });

  describe('update', () => {
    it('should update existing ad', async () => {
      mockPrisma.ad.findUnique.mockResolvedValue({ id: 'a1' });
      mockPrisma.ad.update.mockResolvedValue({ id: 'a1', advertiserName: 'Updated' });
      const result = await service.update('a1', { advertiserName: 'Updated' });
      expect(result.advertiserName).toBe('Updated');
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.ad.findUnique.mockResolvedValue(null);
      await expect(service.update('bad', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete ad', async () => {
      mockPrisma.ad.findUnique.mockResolvedValue({ id: 'a1' });
      mockPrisma.ad.delete.mockResolvedValue({});
      await service.delete('a1');
      expect(mockPrisma.ad.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
    });
  });
});
