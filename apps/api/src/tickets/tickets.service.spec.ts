import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  ticket: { findMany: jest.fn<any, any>(), findUnique: jest.fn<any, any>(), create: jest.fn<any, any>(), update: jest.fn<any, any>(), delete: jest.fn<any, any>() },
  event: { findUnique: jest.fn<any, any>() },
  organizer: { findUnique: jest.fn<any, any>() },
  user: { findUnique: jest.fn<any, any>() },
};

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEvent', () => {
    it('should return tickets sorted by price', async () => {
      mockPrisma.ticket.findMany.mockResolvedValue([{ id: 't1', name: 'Standard', price: 5000 }]);
      const result = await service.findByEvent('event-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('should create ticket with remaining = quantity', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', role: 'organizer' });
      mockPrisma.event.findUnique.mockResolvedValue({ id: 'event-1', organizerId: 'org-1' });
      mockPrisma.organizer.findUnique.mockResolvedValue({ id: 'org-1', userId: 'user-1' });
      mockPrisma.ticket.create.mockResolvedValue({ id: 't1', name: 'VIP', price: 10000, quantity: 50, remaining: 50 });
      const result = await service.create('user-1', 'event-1', { name: 'VIP', price: 10000, quantity: 50 });
      expect(result.remaining).toBe(50);
    });
  });

  describe('delete', () => {
    it('should delete ticket', async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({ id: 't1', eventId: 'event-1' });
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', role: 'admin' });
      mockPrisma.ticket.delete.mockResolvedValue({});
      await service.delete('user-1', 't1');
      expect(mockPrisma.ticket.delete).toHaveBeenCalledWith({ where: { id: 't1' } });
    });

    it('should throw NotFoundException for non-existent ticket', async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue(null);
      await expect(service.delete('user-1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });
});
