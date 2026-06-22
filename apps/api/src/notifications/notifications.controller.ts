import {
  Controller,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Mes notifications',
    description: "Retourne les notifications de l'utilisateur connect\u00e9, avec filtrage optionnel par non-lues.",
  })
  @ApiQuery({ name: 'unreadOnly', required: false, type: String, example: 'true', description: 'Filtrer uniquement les non-lues' })
  @ApiResponse({ status: 200, description: 'Liste des notifications' })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.findAll(user.id, unreadOnly === 'true');
  }

  @Get('unread-count')
  @ApiOperation({
    summary: 'Nombre de notifications non lues',
    description: "Retourne le nombre de notifications non lues pour l'utilisateur connect\u00e9.",
  })
  @ApiResponse({ status: 200, description: "Nombre de notifications non lues: { count }" })
  async unreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.unreadCount(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({
    summary: 'Marquer une notification comme lue',
    description: "Marque une notification sp\u00e9cifique comme lue.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la notification' })
  @ApiResponse({ status: 200, description: 'Notification marqu\u00e9e comme lue' })
  @ApiResponse({ status: 404, description: 'Notification introuvable' })
  async markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.notificationsService.markRead(user.id, id);
  }

  @Patch('read-all')
  @ApiOperation({
    summary: 'Tout marquer comme lu',
    description: "Marque toutes les notifications de l'utilisateur comme lues.",
  })
  @ApiResponse({ status: 200, description: 'Toutes les notifications marqu\u00e9es comme lues' })
  async markAllRead(@CurrentUser() user: AuthenticatedUser) {
    await this.notificationsService.markAllRead(user.id);
    return { message: 'Toutes les notifications marqu\u00e9es comme lues.' };
  }
}
