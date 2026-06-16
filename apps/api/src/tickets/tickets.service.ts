import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByEvent(eventId: string) {
    return this.prisma.ticket.findMany({
      where: { eventId },
      orderBy: { price: 'asc' },
    });
  }

  async create(userId: string, eventId: string, dto: CreateTicketDto) {
    await this.checkEventOwnership(userId, eventId);

    const ticket = await this.prisma.ticket.create({
      data: {
        eventId,
        ...dto,
        remaining: dto.quantity,
      },
    });

    this.logger.log(`Ticket créé: ${ticket.name} pour event ${eventId}`);
    return ticket;
  }

  async update(userId: string, ticketId: string, dto: UpdateTicketDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });

    if (!ticket) {
      throw new NotFoundException({
        code: 'TICKET_NOT_FOUND',
        message: 'Ticket introuvable.',
      });
    }

    await this.checkEventOwnership(userId, ticket.eventId);

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...dto,
        quantity: dto.quantity ?? undefined,
        remaining: dto.quantity ?? undefined,
      },
    });

    return updated;
  }

  async delete(userId: string, ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true },
    });

    if (!ticket) {
      throw new NotFoundException({
        code: 'TICKET_NOT_FOUND',
        message: 'Ticket introuvable.',
      });
    }

    await this.checkEventOwnership(userId, ticket.eventId);
    await this.prisma.ticket.delete({ where: { id: ticketId } });
  }

  private async checkEventOwnership(userId: string, eventId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === 'admin') return;

    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException({
        code: 'EVENT_NOT_FOUND',
        message: 'Événement introuvable.',
      });
    }

    const organizer = await this.prisma.organizer.findUnique({ where: { userId } });
    if (!organizer || organizer.id !== event.organizerId) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: "Vous n'avez pas les droits sur cet événement.",
      });
    }
  }
}
