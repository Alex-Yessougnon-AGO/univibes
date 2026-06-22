import {
  Controller,
  Get,
  Post,
  Delete,
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
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('favorites')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: 'Mes \u00e9v\u00e9nements favoris',
    description: "Retourne la liste des \u00e9v\u00e9nements favorites par l'utilisateur connect\u00e9.",
  })
  @ApiResponse({ status: 200, description: 'Liste des favoris avec les d\u00e9tails des \u00e9v\u00e9nements' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.findAll(user.id);
  }

  @Post(':eventId')
  @ApiOperation({
    summary: 'Ajouter un favori',
    description: "Ajoute un \u00e9v\u00e9nement aux favoris de l'utilisateur connect\u00e9.",
  })
  @ApiParam({ name: 'eventId', required: true, type: String, description: "ID de l'\u00e9v\u00e9nement" })
  @ApiResponse({ status: 201, description: 'Favori ajout\u00e9' })
  @ApiResponse({ status: 409, description: 'D\u00e9j\u00e0 dans les favoris' })
  async add(
    @CurrentUser() user: AuthenticatedUser,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    return this.favoritesService.add(user.id, eventId);
  }

  @Delete(':eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un favori',
    description: "Retire un \u00e9v\u00e9nement des favoris de l'utilisateur.",
  })
  @ApiParam({ name: 'eventId', required: true, type: String, description: "ID de l'\u00e9v\u00e9nement" })
  @ApiResponse({ status: 200, description: 'Favori supprim\u00e9' })
  @ApiResponse({ status: 404, description: 'Favori introuvable' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    await this.favoritesService.remove(user.id, eventId);
    return { message: 'Favori supprim\u00e9.' };
  }

  @Post('toggle/:eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Ajouter/retirer un favori (toggle)",
    description: "Ajoute ou retire un \u00e9v\u00e9nement des favoris selon son \u00e9tat actuel. Retourne le nouvel \u00e9tat (favorite: true/false).",
  })
  @ApiParam({ name: 'eventId', required: true, type: String, description: "ID de l'\u00e9v\u00e9nement" })
  @ApiResponse({ status: 200, description: '\u00c9tat du favori mis \u00e0 jour' })
  async toggle(
    @CurrentUser() user: AuthenticatedUser,
    @Param('eventId', ParseUUIDPipe) eventId: string,
  ) {
    return this.favoritesService.toggle(user.id, eventId);
  }
}
