import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { BoostsService } from './boosts.service';
import { CreateBoostDto } from './dto/create-boost.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('boosts')
@ApiBearerAuth('access-token')
@Controller('boosts')
export class BoostsController {
  constructor(private readonly boostsService: BoostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @ApiOperation({
    summary: 'Cr\u00e9er un boost pour un \u00e9v\u00e9nement',
    description: "Permet de booster un \u00e9v\u00e9nement pour augmenter sa visibilit\u00e9 (24h, 72h ou 7 jours). N\u00e9cessite d'\u00eatre organisateur.",
  })
  @ApiBody({ type: CreateBoostDto, description: "Type de boost (h24, h72, days7)" })
  @ApiResponse({ status: 201, description: 'Boost cr\u00e9\u00e9' })
  @ApiResponse({ status: 404, description: '\u00c9v\u00e9nement introuvable' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBoostDto,
  ) {
    return this.boostsService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @ApiOperation({
    summary: 'Mes boosts',
    description: "Retourne la liste des boosts cr\u00e9\u00e9s par l'organisateur connect\u00e9.",
  })
  @ApiResponse({ status: 200, description: 'Liste des boosts' })
  async findMy(@CurrentUser() user: AuthenticatedUser) {
    return this.boostsService.findByUser(user.id);
  }
}
