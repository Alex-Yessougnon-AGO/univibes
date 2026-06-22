import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';

// Mock prisma
const mockPrisma = {
  user: {
    findUnique: jest.fn<any, any>(),
    create: jest.fn<any, any>(),
    update: jest.fn<any, any>(),
  },
  refreshToken: {
    findUnique: jest.fn<any, any>(),
    findMany: jest.fn<any, any>(),
    create: jest.fn<any, any>(),
    delete: jest.fn<any, any>(),
    deleteMany: jest.fn<any, any>(),
  },
  emailVerification: {
    findUnique: jest.fn<any, any>(),
    create: jest.fn<any, any>(),
    delete: jest.fn<any, any>(),
  },
  passwordResetToken: {
    findUnique: jest.fn<any, any>(),
    create: jest.fn<any, any>(),
    update: jest.fn<any, any>(),
  },
  profile: {
    update: jest.fn<any, any>(),
  },
  $transaction: jest.fn<any, any>(),
};

const mockAuditService = {
  log: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock-token'),
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@test.com',
      fullname: 'Test User',
      password: 'Password123!',
      phone: '+22997000000',
      city: 'Cotonou',
      university: 'UAC',
    };

    it('should create a new user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: registerDto.email,
        role: 'student',
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        profile: { fullname: registerDto.fullname, avatarUrl: null },
      });
      mockPrisma.emailVerification.create.mockResolvedValue({});

      const result = await service.register(registerDto, '127.0.0.1');

      expect(result.user.email).toBe(registerDto.email);
      expect(result.user.role).toBe('student');
      expect(result.tokens.accessToken).toBe('mock-token');
      expect(result.tokens.refreshToken).toBe('mock-token');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'USER_REGISTERED' }),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.register(registerDto, '127.0.0.1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@test.com', password: 'Password123!' };

    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 12);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'student',
        isActive: true,
        profile: { fullname: 'Test User', avatarUrl: null },
      });

      const result = await service.login(loginDto, '127.0.0.1');

      expect(result.user.email).toBe('test@test.com');
      expect(result.tokens.accessToken).toBe('mock-token');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: await bcrypt.hash('wrong-password', 12),
        role: 'student',
        isActive: true,
        profile: { fullname: 'Test User', avatarUrl: null },
      });

      await expect(
        service.login({ ...loginDto, password: 'WrongPassword1!' }, '127.0.0.1'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for disabled account', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@test.com',
        password: 'hashed',
        role: 'student',
        isActive: false,
        profile: { fullname: 'Test User', avatarUrl: null },
      });

      await expect(service.login(loginDto, '127.0.0.1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      mockPrisma.emailVerification.findUnique.mockResolvedValue({
        id: 'verif-1',
        userId: 'user-1',
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 3600000),
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.emailVerification.delete.mockResolvedValue({});

      await service.verifyEmail('valid-token');
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: { emailVerified: true },
        }),
      );
    });

    it('should throw BadRequestException for expired token', async () => {
      mockPrisma.emailVerification.findUnique.mockResolvedValue({
        id: 'verif-1',
        userId: 'user-1',
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 3600000),
      });

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid token', async () => {
      mockPrisma.emailVerification.findUnique.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
