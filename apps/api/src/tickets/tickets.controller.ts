import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/create-ticket.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':eventId')
  @Public()
  @ApiOperation({
    summary: 'Billets disponibles pour un \u00e9v\u00e9nement',
    description: 'Retourne tous les types de billets disponibles pour un \u00e9v\u00e9nement, tri\u00e9s par prix croissant.',
  })
  @ApiParam({ name: 'eventId', required: true, type: String, description: "ID de l'\u00e9v\u00e9nement" })
  @ApiResponse({ status: 200, description: 'Liste des billets' })
  async findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.ticketsService.findByEvent(eventId);
  }

  @Post(':eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cr\u00e9er un type de billet',
    description: "Cr\u00e9e un nouveau type de billet pour un \u00e9v\u00e9nement. L'utilisateur doit \u00eatre l'organisateur de l'\u00e9v\u00e9nement.",
  })
  @ApiParam({ name: 'eventId', required: true, type: String, description: "ID de l'\u00e9v\u00e9nement" })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({ status: 201, description: 'Billet cr\u00e9\u00e9' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() dto: CreateTicketDto,
  ) {
    return this.ticketsService.create(user.id, eventId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Modifier un billet',
    description: "Met \u00e0 jour un type de billet existant.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID du billet' })
  @ApiBody({ type: UpdateTicketDto })
  @ApiResponse({ status: 200, description: 'Billet mis \u00e0 jour' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un billet',
    description: 'Supprime d\u00e9finitivement un type de billet.',
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID du billet' })
  @ApiResponse({ status: 200, description: 'Billet supprim\u00e9' })
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.ticketsService.delete(user.id, id);
    return { message: 'Billet supprim\u00e9.' };
  }
}
