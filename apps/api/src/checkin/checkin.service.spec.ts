import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  issuedTicket: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('CheckinService', () => {
  let service: CheckinService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckinService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CheckinService>(CheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verify', () => {
    const mockTicket = {
      id: 'ticket-1',
      qrCode: 'UV-ABC123',
      checkedIn: false,
      checkedInAt: null,
      ticket: { name: 'Entrée Standard' },
      order: { event: { title: 'Soirée de Gala' } },
      user: { profile: { fullname: 'Jean Dupont' } },
    };

    it('should return ticket info for a valid QR code', async () => {
      mockPrisma.issuedTicket.findUnique.mockResolvedValue(mockTicket);

      const result = await service.verify('UV-ABC123');

      expect(result.valid).toBe(true);
      expect(result.used).toBe(false);
      expect(result.attendee.name).toBe('Jean Dupont');
      expect(result.attendee.ticketName).toBe('Entrée Standard');
      expect(result.attendee.eventName).toBe('Soirée de Gala');
    });

    it('should indicate the ticket was already used', async () => {
      mockPrisma.issuedTicket.findUnique.mockResolvedValue({
        ...mockTicket,
        checkedIn: true,
        checkedInAt: new Date(),
      });

      const result = await service.verify('UV-ABC123');
      expect(result.used).toBe(true);
      expect(result.checkedInAt).toBeTruthy();
    });

    it('should throw NotFoundException for invalid QR code', async () => {
      mockPrisma.issuedTicket.findUnique.mockResolvedValue(null);

      await expect(service.verify('INVALID')).rejects.toThrow(NotFoundException);
    });

    it('should handle missing user profile gracefully', async () => {
      mockPrisma.issuedTicket.findUnique.mockResolvedValue({
        ...mockTicket,
        user: { profile: null },
      });

      const result = await service.verify('UV-ABC123');
      expect(result.attendee.name).toBe('Inconnu');
    });
  });

  describe('verifyAndCheckin', () => {
    const mockTicket = {
      id: 'ticket-1',
      qrCode: 'UV-ABC123',
      checkedIn: false,
      checkedInAt: null,
      ticket: { name: 'VIP' },
      order: { event: { title: 'Concert' } },
      user: { profile: { fullname: 'Marie Claire' } },
    };

    it('should check in a valid ticket', async () => {
      mockPrisma.issuedTicket.findUnique.mockResolvedValue(mockTicket);
      mockPrisma.issuedTicket.update.mockResolvedValue({
        ...mockTicket,
        checkedIn: true,
        checkedInAt: new Date(),
      });

      const result = await service.verifyAndCheckin('UV-ABC123');

      expect(result.success).toBe(true);
      expect(result.attendee.name).toBe('Marie Claire');
      expect(result.attendee.eventName).toBe('Concert');
    });

    it('should throw ConflictException for already checked-in ticket', async () => {
      mockPrisma.issuedTicket.findUnique.mockResolvedValue({
        ...mockTicket,
        checkedIn: true,
      });

      await expect(service.verifyAndCheckin('UV-ABC123')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException for invalid QR code', async () => {
      mockPrisma.issuedTicket.findUnique.mockResolvedValue(null);

      await expect(service.verifyAndCheckin('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
