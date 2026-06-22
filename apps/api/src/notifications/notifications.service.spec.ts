import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  notification: { findMany: jest.fn<any, any>(), count: jest.fn<any, any>(), findFirst: jest.fn<any, any>(), update: jest.fn<any, any>(), updateMany: jest.fn<any, any>(), create: jest.fn<any, any>() },
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return notifications with total', async () => {
      mockPrisma.notification.findMany.mockResolvedValue([{ id: 'n1' }]);
      mockPrisma.notification.count.mockResolvedValue(1);
      const result = await service.findAll('user-1');
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should filter unread only', async () => {
      await service.findAll('user-1', true);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1', read: false } }),
      );
    });
  });

  describe('unreadCount', () => {
    it('should return count', async () => {
      mockPrisma.notification.count.mockResolvedValue(5);
      const result = await service.unreadCount('user-1');
      expect(result.count).toBe(5);
    });
  });

  describe('markRead', () => {
    it('should mark notification as read', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue({ id: 'n1' });
      mockPrisma.notification.update.mockResolvedValue({ id: 'n1', read: true });
      const result = await service.markRead('user-1', 'n1');
      expect(result.read).toBe(true);
    });

    it('should throw if not found', async () => {
      mockPrisma.notification.findFirst.mockResolvedValue(null);
      await expect(service.markRead('user-1', 'bad')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create notification', async () => {
      mockPrisma.notification.create.mockResolvedValue({ id: 'n1', type: 'test', title: 'Test' });
      const result = await service.create('user-1', 'test', 'Test', 'Body');
      expect(result.title).toBe('Test');
    });
  });
});
