import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';

const mockPrisma = {
  order: {
    findUnique: jest.fn<any, any>(),
    findMany: jest.fn<any, any>(),
    create: jest.fn<any, any>(),
    update: jest.fn<any, any>(),
  },
  event: {
    findUnique: jest.fn<any, any>(),
  },
  ticket: {
    update: jest.fn<any, any>(),
  },
  issuedTicket: {
    create: jest.fn<any, any>(),
  },
  $transaction: jest.fn<any, any>(),
};

const mockAuditService = {
  log: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return user orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([
        { id: 'order-1', event: { title: 'Test' }, items: [], payment: null },
      ]);

      const result = await service.findAll('user-1');

      expect(result).toHaveLength(1);
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      );
    });
  });

  describe('create', () => {
    const createDto = {
      eventId: 'event-1',
      items: [{ ticketId: 'ticket-1', quantity: 2 }],
    };

    it('should create order successfully', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 'event-1',
        status: 'approved',
        tickets: [
          {
            id: 'ticket-1',
            name: 'Standard',
            price: 5000,
            remaining: 50,
            quantity: 100,
          },
        ],
      });

      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        mockPrisma.ticket.update = jest.fn<any, any>().mockResolvedValue({});
        mockPrisma.order.create = jest.fn<any, any>().mockResolvedValue({
          id: 'order-1',
          event: { title: 'Test Event' },
          items: [{ ticketId: 'ticket-1', quantity: 2 }],
        });
        return fn(mockPrisma);
      });

      const result = await service.create('user-1', createDto);

      expect(result).toBeDefined();
    });

    it('should throw BadRequestException for insufficient stock', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 'event-1',
        status: 'approved',
        tickets: [
          {
            id: 'ticket-1',
            name: 'Standard',
            price: 5000,
            remaining: 1,
            quantity: 100,
          },
        ],
      });

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for non-approved event', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 'event-1',
        status: 'pending',
        tickets: [],
      });

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
