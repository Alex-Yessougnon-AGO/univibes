import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Mes événements favoris' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.findAll(user.id);
  }

  @Post(':eventId')
  @ApiOperation({ summary: 'Ajouter un favori' })
  async add(
    @CurrentUser() user: AuthenticatedUser,
    @Param('eventId') eventId: string,
  ) {
    return this.favoritesService.add(user.id, eventId);
  }

  @Delete(':eventId')
  @ApiOperation({ summary: 'Supprimer un favori' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('eventId') eventId: string,
  ) {
    await this.favoritesService.remove(user.id, eventId);
    return { message: 'Favori supprimé.' };
  }
}
