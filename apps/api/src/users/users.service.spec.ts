import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';

const mockPrisma = {
  user: { findUnique: jest.fn<any, any>(), delete: jest.fn<any, any>() },
  profile: { update: jest.fn<any, any>() },
};

const mockAudit = { log: jest.fn() };

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile with stats', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1', email: 'test@test.com', role: 'student', emailVerified: true,
        createdAt: new Date(), profile: { fullname: 'Test' }, organizer: null,
        _count: { favorites: 3, orders: 1 },
      });
      const result = await service.getProfile('user-1');
      expect(result.email).toBe('test@test.com');
      expect(result.stats.favoritesCount).toBe(3);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getProfile('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update and return profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', profile: { id: 'prof-1' } });
      mockPrisma.profile.update.mockResolvedValue({ id: 'prof-1', fullname: 'Updated' });
      const result = await service.updateProfile('user-1', { fullname: 'Updated' });
      expect(result.fullname).toBe('Updated');
      expect(mockAudit.log).toHaveBeenCalledWith(expect.objectContaining({ action: 'PROFILE_UPDATED' }));
    });
  });

  describe('deleteAccount', () => {
    it('should delete user and log audit', async () => {
      mockPrisma.user.delete.mockResolvedValue({});
      await service.deleteAccount('user-1');
      expect(mockAudit.log).toHaveBeenCalledWith(expect.objectContaining({ action: 'ACCOUNT_DELETED' }));
    });
  });
});
