import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { FedaPayService } from './fedapay.service';

const mockPrisma = {
  order: { findUnique: jest.fn<any, any>() },
  payment: { create: jest.fn<any, any>(), findFirst: jest.fn<any, any>(), findUnique: jest.fn<any, any>(), update: jest.fn<any, any>() },
  $transaction: jest.fn<any, any>(),
};

const mockAudit = { log: jest.fn() };

const mockFedaPayService = {
  createTransaction: jest.fn(),
  verifyWebhook: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: any) => {
    if (key === 'APP_URL') return 'http://localhost:3001';
    return defaultValue;
  }),
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
        { provide: FedaPayService, useValue: mockFedaPayService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initiate', () => {
    it('should initiate payment with valid provider', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order-1', userId: 'user-1', eventId: 'event-1', amount: 10000, status: 'pending' });
      mockPrisma.payment.create.mockResolvedValue({ id: 'pay-1' });
      const result = await service.initiate('user-1', { orderId: 'order-1', provider: 'fedapay' });
      expect(result.paymentId).toBe('pay-1');
      expect(result.amount).toBe(10000);
    });

    it('should throw for invalid provider', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order-1', userId: 'user-1', status: 'pending' });
      await expect(service.initiate('user-1', { orderId: 'order-1', provider: 'stripe' })).rejects.toThrow(BadRequestException);
    });

    it('should throw for already paid order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 'order-1', userId: 'user-1', status: 'paid' });
      await expect(service.initiate('user-1', { orderId: 'order-1', provider: 'fedapay' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('handleWebhook', () => {
    it('should process successful payment webhook', async () => {
      mockPrisma.payment.findFirst.mockResolvedValue({ id: 'pay-1', orderId: 'order-1' });
      mockPrisma.$transaction.mockImplementation(async (fn: any) => fn({
        payment: { update: jest.fn() },
        order: { update: jest.fn(), findUnique: jest.fn().mockResolvedValue({}) },
      }));
      await service.handleWebhook({ provider: 'fedapay', providerReference: 'ref-1', status: 'success' });
      expect(mockAudit.log).toHaveBeenCalledWith(expect.objectContaining({ action: 'PAYMENT_WEBHOOK' }));
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue({ id: 'pay-1', status: 'success' });
      const result = await service.getPaymentStatus('order-1');
      expect(result.status).toBe('success');
    });

    it('should throw if not found', async () => {
      mockPrisma.payment.findUnique.mockResolvedValue(null);
      await expect(service.getPaymentStatus('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
