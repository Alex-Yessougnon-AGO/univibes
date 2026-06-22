import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';

const mockPrisma = {
  organizer: { findUnique: jest.fn<any, any>(), create: jest.fn<any, any>(), update: jest.fn<any, any>() },
  user: { update: jest.fn<any, any>(), findUnique: jest.fn<any, any>() },
  event: { count: jest.fn<any, any>(), aggregate: jest.fn<any, any>() },
  order: { count: jest.fn<any, any>(), findMany: jest.fn<any, any>() },
};

const mockAudit = { log: jest.fn() };

describe('OrganizersService', () => {
  let service: OrganizersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();
    service = module.get<OrganizersService>(OrganizersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create organizer and update user role', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue(null);
      mockPrisma.organizer.create.mockResolvedValue({ id: 'org-1', organizationName: 'Club' });
      mockPrisma.user.update.mockResolvedValue({});
      const result = await service.create('user-1', { organizationName: 'Club' });
      expect(result.organizationName).toBe('Club');
      expect(mockAudit.log).toHaveBeenCalledWith(expect.objectContaining({ action: 'ORGANIZER_CREATED' }));
    });

    it('should throw ConflictException if already organizer', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue({ id: 'org-1' });
      await expect(service.create('user-1', { organizationName: 'Club' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return organizer with events', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue({ id: 'org-1', user: { profile: {} }, events: [], _count: { events: 5, boosts: 2 } });
      const result = await service.findById('org-1');
      expect(result._count.events).toBe(5);
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue(null);
      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard stats', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue({ id: 'org-1', userId: 'user-1' });
      mockPrisma.event.count.mockResolvedValue(10);
      mockPrisma.event.aggregate.mockResolvedValue({ _sum: { views: 500 } });
      mockPrisma.order.count.mockResolvedValue(25);
      mockPrisma.order.findMany.mockResolvedValue([]);
      const result = await service.getDashboard('user-1');
      expect(result.stats.totalEvents).toBe(10);
      expect(result.stats.totalViews).toBe(500);
    });

    it('should throw for non-organizer', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue(null);
      await expect(service.getDashboard('user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
