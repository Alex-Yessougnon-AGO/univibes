import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CheckinService {
  private readonly logger = new Logger(CheckinService.name);

  constructor(private readonly prisma: PrismaService) {}

  async verify(qrCode: string) {
    const ticket = await this.prisma.issuedTicket.findUnique({
      where: { qrCode },
      include: {
        ticket: { select: { name: true } },
        order: { include: { event: { select: { title: true } } } },
        user: { include: { profile: { select: { fullname: true } } } },
      },
    });

    if (!ticket) {
      throw new NotFoundException({
        code: 'INVALID_QR_CODE',
        message: 'Ce QR code ne correspond \u00e0 aucun billet valide.',
      });
    }

    return {
      valid: true,
      used: ticket.checkedIn,
      checkedInAt: ticket.checkedInAt,
      attendee: {
        name: ticket.user.profile?.fullname ?? 'Inconnu',
        ticketName: ticket.ticket.name,
        eventName: ticket.order.event.title,
      },
    };
  }

  async verifyAndCheckin(qrCode: string) {
    const ticket = await this.prisma.issuedTicket.findUnique({
      where: { qrCode },
      include: {
        ticket: { select: { name: true } },
        order: { include: { event: { select: { title: true } } } },
        user: { include: { profile: { select: { fullname: true } } } },
      },
    });

    if (!ticket) {
      throw new NotFoundException({
        code: 'INVALID_QR_CODE',
        message: 'Ce QR code ne correspond \u00e0 aucun billet valide.',
      });
    }

    if (ticket.checkedIn) {
      throw new ConflictException({
        code: 'ALREADY_CHECKED_IN',
        message: 'Ce billet a d\u00e9j\u00e0 \u00e9t\u00e9 scann\u00e9.',
      });
    }

    const updated = await this.prisma.issuedTicket.update({
      where: { id: ticket.id },
      data: { checkedIn: true, checkedInAt: new Date() },
    });

    this.logger.log(`Check-in r\u00e9ussi: ${ticket.user.profile?.fullname} pour ${ticket.order.event.title}`);

    return {
      success: true,
      message: 'Check-in r\u00e9ussi !',
      attendee: {
        name: ticket.user.profile?.fullname ?? 'Inconnu',
        ticketName: ticket.ticket.name,
        eventName: ticket.order.event.title,
      },
      checkedInAt: updated.checkedInAt,
    };
  }
}
