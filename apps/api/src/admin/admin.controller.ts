import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
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
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Tableau de bord admin',
    description: "Retourne les statistiques globales de la plateforme\u00a0: utilisateurs, \u00e9v\u00e9nements, organisateurs, revenus.",
  })
  @ApiResponse({ status: 200, description: 'Statistiques du tableau de bord' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @ApiOperation({
    summary: 'Liste des utilisateurs',
    description: "Retourne la liste pagin\u00e9e de tous les utilisateurs de la plateforme.",
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs avec pagination' })
  async getUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getUsers(page, limit);
  }

  @Get('users/:id')
  @ApiOperation({
    summary: "D\u00e9tails d'un utilisateur",
    description: "Retourne les informations d\u00e9taill\u00e9es d'un utilisateur avec son profil, ses commandes et son organisateur.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: "D\u00e9tails de l'utilisateur" })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({
    summary: "Changer le r\u00f4le d'un utilisateur",
    description: "Modifie le r\u00f4le d'un utilisateur (student, organizer, moderator, admin).",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'utilisateur" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['student', 'organizer', 'moderator', 'admin'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'R\u00f4le mis \u00e0 jour' })
  async updateUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role as any);
  }

  @Patch('users/:id/toggle-status')
  @ApiOperation({
    summary: 'Activer/D\u00e9sactiver un utilisateur',
    description: "Active ou d\u00e9sactive le compte d'un utilisateur.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Statut mis \u00e0 jour' })
  async toggleUserStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get('events')
  @ApiOperation({
    summary: 'Tous les \u00e9v\u00e9nements',
    description: "Retourne tous les \u00e9v\u00e9nements de la plateforme, filtr\u00e9s optionnellement par statut.",
  })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filtrer par statut (pending, approved, rejected, draft, archived)' })
  @ApiResponse({ status: 200, description: 'Liste des \u00e9v\u00e9nements' })
  async getEvents(@Query('status') status?: string) {
    return this.adminService.getEvents(status);
  }

  @Get('events/pending')
  @ApiOperation({
    summary: '\u00c9v\u00e9nements en attente de validation',
    description: "Retourne les \u00e9v\u00e9nements en attente d'approbation par un administrateur.",
  })
  @ApiResponse({ status: 200, description: '\u00c9v\u00e9nements en attente' })
  async getPendingEvents() {
    return this.adminService.getPendingEvents();
  }

  @Post('events/:id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Approuver un \u00e9v\u00e9nement",
    description: "Approuve un \u00e9v\u00e9nement en attente de validation.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'\u00e9v\u00e9nement" })
  @ApiResponse({ status: 200, description: '\u00c9v\u00e9nement approuv\u00e9' })
  async approveEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.approveEvent(id, user.id);
  }

  @Post('events/:id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refuser un \u00e9v\u00e9nement",
    description: "Refuse un \u00e9v\u00e9nement avec un motif optionnel.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'\u00e9v\u00e9nement" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Motif du refus (optionnel)' },
      },
    },
    required: false,
  })
  @ApiResponse({ status: 200, description: '\u00c9v\u00e9nement refus\u00e9' })
  async rejectEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.rejectEvent(id, user.id, reason);
  }

  @Get('organizers')
  @ApiOperation({
    summary: 'Liste des organisateurs',
    description: "Retourne tous les organisateurs avec le nombre de leurs \u00e9v\u00e9nements et boosts.",
  })
  @ApiResponse({ status: 200, description: 'Liste des organisateurs' })
  async getOrganizers() {
    return this.adminService.getOrganizers();
  }

  @Post('organizers/:id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'V\u00e9rifier un organisateur',
    description: "Active ou d\u00e9sactive la v\u00e9rification d'un organisateur.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'organisateur" })
  @ApiResponse({ status: 200, description: 'Statut de v\u00e9rification mis \u00e0 jour' })
  async verifyOrganizer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.verifyOrganizer(id, user.id);
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Transactions r\u00e9centes',
    description: "Retourne les 50 derni\u00e8res transactions trait\u00e9es (non en attente).",
  })
  @ApiResponse({ status: 200, description: 'Liste des transactions' })
  async getTransactions() {
    return this.adminService.getTransactions();
  }

  @Get('boosts')
  @ApiOperation({
    summary: 'Tous les boosts',
    description: "Retourne tous les boosts avec les \u00e9v\u00e9nements et organisateurs.",
  })
  @ApiResponse({ status: 200, description: 'Liste des boosts' })
  async getBoosts() {
    return this.adminService.getBoosts();
  }

  @Get('universities')
  @ApiOperation({
    summary: 'Universit\u00e9s',
    description: "Retourne la liste des universit\u00e9s avec le nombre d'\u00e9tudiants et de profils associ\u00e9s.",
  })
  @ApiResponse({ status: 200, description: 'Liste des universit\u00e9s' })
  async getUniversities() {
    return this.adminService.getUniversities();
  }

  @Get('settings')
  @ApiOperation({
    summary: 'Param\u00e8tres plateforme',
    description: "Retourne les param\u00e8tres actuels de la plateforme.",
  })
  @ApiResponse({ status: 200, description: 'Param\u00e8tres' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @ApiOperation({
    summary: 'Mettre \u00e0 jour les param\u00e8tres',
    description: "Met \u00e0 jour les param\u00e8tres de la plateforme.",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        commission: { type: 'number', example: 5 },
        maxEventsPerOrg: { type: 'number', example: 50 },
        requireVerification: { type: 'boolean', example: true },
        maintenance: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Param\u00e8tres mis \u00e0 jour' })
  async updateSettings(@Body() settings: any) {
    return this.adminService.updateSettings(settings);
  }

  @Get('audit-logs')
  @ApiOperation({
    summary: "Logs d'audit",
    description: "Retourne les logs d'audit r\u00e9cents des actions administrateurs.",
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Liste des logs' })
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.adminService.getAuditLogs(limit);
  }
}
