import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BoostsService } from './boosts.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  organizer: { findUnique: jest.fn<any, any>() },
  event: { findFirst: jest.fn<any, any>() },
  boost: { create: jest.fn<any, any>(), findMany: jest.fn<any, any>() },
};

describe('BoostsService', () => {
  let service: BoostsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoostsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<BoostsService>(BoostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a boost', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue({ id: 'org-1', userId: 'user-1' });
      mockPrisma.event.findFirst.mockResolvedValue({ id: 'event-1', organizerId: 'org-1' });
      mockPrisma.boost.create.mockResolvedValue({ id: 'b1', boostType: 'h24' });
      const result = await service.create('user-1', { eventId: 'event-1', boostType: 'h24' });
      expect(result.boostType).toBe('h24');
    });

    it('should throw for non-organizer', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue(null);
      await expect(service.create('user-1', { eventId: 'event-1', boostType: 'h24' })).rejects.toThrow(NotFoundException);
    });

    it('should throw for invalid boost type', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue({ id: 'org-1', userId: 'user-1' });
      mockPrisma.event.findFirst.mockResolvedValue({ id: 'event-1' });
      await expect(service.create('user-1', { eventId: 'event-1', boostType: 'invalid' as any })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUser', () => {
    it('should return boosts for organizer', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue({ id: 'org-1', userId: 'user-1' });
      mockPrisma.boost.findMany.mockResolvedValue([{ id: 'b1' }]);
      const result = await service.findByUser('user-1');
      expect(result).toHaveLength(1);
    });

    it('should return empty for non-organizer', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue(null);
      const result = await service.findByUser('user-1');
      expect(result).toEqual([]);
    });
  });
});
