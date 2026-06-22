import {
  Controller,
  Get,
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
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Obtenir son profil',
    description: "Retourne le profil complet de l'utilisateur connect\u00e9 avec ses statistiques (favoris, commandes).",
  })
  @ApiResponse({ status: 200, description: 'Profil utilisateur' })
  @ApiResponse({ status: 401, description: 'Authentification requise' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Profil public',
    description: "Retourne le profil public d'un utilisateur (fullname, avatar, ville, universit\u00e9, statut organisateur).",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Profil public' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  async getPublicProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Modifier son profil',
    description: "Met \u00e0 jour les informations du profil de l'utilisateur connect\u00e9.",
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profil mis \u00e0 jour' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer son compte',
    description: "Supprime d\u00e9finitivement le compte de l'utilisateur connect\u00e9 et toutes ses donn\u00e9es associ\u00e9es.",
  })
  @ApiResponse({ status: 200, description: 'Compte supprim\u00e9' })
  async deleteAccount(@CurrentUser() user: AuthenticatedUser) {
    await this.usersService.deleteAccount(user.id);
    return { message: 'Compte supprim\u00e9 avec succ\u00e8s.' };
  }
}
