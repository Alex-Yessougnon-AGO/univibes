import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { CacheService } from '../cache/cache.service';

const mockPrisma = {
  organizer: {
    findUnique: jest.fn(),
  },
  event: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

const mockAuditService = {
  log: jest.fn(),
};

const mockCacheService = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn(),
  del: jest.fn(),
  delPattern: jest.fn(),
};

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAuditService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      mockPrisma.event.findMany.mockResolvedValue([
        { id: 'event-1', title: 'Test Event', status: 'approved' },
      ]);
      mockPrisma.event.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should apply search filter', async () => {
      mockPrisma.event.findMany.mockResolvedValue([]);
      mockPrisma.event.count.mockResolvedValue(0);

      await service.findAll({ search: 'soirée' });

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: expect.objectContaining({ contains: 'soirée' }) }),
            ]),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return event by slug and increment views', async () => {
      mockPrisma.event.findUnique.mockResolvedValue({
        id: 'event-1',
        slug: 'test-event',
        title: 'Test Event',
        views: 10,
        category: null,
        organizer: null,
        tickets: [],
        _count: { favorites: 0, orders: 0 },
      });
      mockPrisma.event.update.mockResolvedValue({});

      const result = await service.findOne('test-event');

      expect(result.title).toBe('Test Event');
      expect(result.views).toBe(11);
      expect(mockPrisma.event.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'event-1' },
          data: { views: { increment: 1 } },
        }),
      );
    });

    it('should throw NotFoundException for non-existent slug', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = {
      title: 'New Event',
      description: 'Event description',
      location: 'Campus',
      city: 'Cotonou',
      startDate: '2026-10-15T18:00:00Z',
      endDate: '2026-10-15T23:00:00Z',
      isFree: true,
    };

    it('should create event if user is organizer', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue({
        id: 'org-1',
        userId: 'user-1',
      });
      mockPrisma.event.create.mockResolvedValue({
        id: 'event-1',
        ...createDto,
        slug: 'new-event',
        status: 'pending',
        category: null,
        organizer: { user: { profile: { fullname: 'Test User' } } },
      });

      const result = await service.create('user-1', createDto);

      expect(result.id).toBe('event-1');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'EVENT_CREATED' }),
      );
    });

    it('should throw ForbiddenException if user is not organizer', async () => {
      mockPrisma.organizer.findUnique.mockResolvedValue(null);

      await expect(service.create('user-1', createDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
