import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BoostsService } from './boosts.service';
import { CreateBoostDto } from './dto/create-boost.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('boosts')
@ApiBearerAuth()
@Controller('boosts')
export class BoostsController {
  constructor(private readonly boostsService: BoostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @ApiOperation({ summary: 'Créer un boost pour un événement' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBoostDto,
  ) {
    return this.boostsService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @ApiOperation({ summary: 'Mes boosts' })
  async findMy(@CurrentUser() user: AuthenticatedUser) {
    return this.boostsService.findByUser(user.id);
  }
}
