import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Tableau de bord admin' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @ApiOperation({ summary: 'Liste des utilisateurs' })
  async getUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getUsers(page, limit);
  }

  @Get('users/:id')
  @ApiOperation({ summary: "Détails d'un utilisateur" })
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: "Changer le rôle d'un utilisateur" })
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return this.adminService.updateUserRole(id, role as any);
  }

  @Patch('users/:id/toggle-status')
  @ApiOperation({ summary: 'Activer/Désactiver un utilisateur' })
  async toggleUserStatus(@Param('id') id: string) {
    return this.adminService.toggleUserStatus(id);
  }

  @Get('events')
  @ApiOperation({ summary: 'Tous les événements' })
  async getEvents(@Query('status') status?: string) {
    return this.adminService.getEvents(status);
  }

  @Get('events/pending')
  @ApiOperation({ summary: 'Événements en attente de validation' })
  async getPendingEvents() {
    return this.adminService.getPendingEvents();
  }

  @Post('events/:id/approve')
  @ApiOperation({ summary: "Approuver un événement" })
  async approveEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.adminService.approveEvent(id, user.id);
  }

  @Post('events/:id/reject')
  @ApiOperation({ summary: "Refuser un événement" })
  async rejectEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.adminService.rejectEvent(id, user.id, reason);
  }

  @Get('organizers')
  @ApiOperation({ summary: 'Liste des organisateurs' })
  async getOrganizers() {
    return this.adminService.getOrganizers();
  }

  @Post('organizers/:id/verify')
  @ApiOperation({ summary: 'Vérifier un organisateur' })
  async verifyOrganizer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.adminService.verifyOrganizer(id, user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Transactions récentes' })
  async getTransactions() {
    return this.adminService.getTransactions();
  }
}
