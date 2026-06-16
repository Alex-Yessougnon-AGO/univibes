import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizersService } from './organizers.service';
import { CreateOrganizerDto, UpdateOrganizerDto } from './dto/create-organizer.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('organizers')
@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Devenir organisateur" })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrganizerDto,
  ) {
    return this.organizersService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mon profil organisateur" })
  async getMy(@CurrentUser() user: AuthenticatedUser) {
    return this.organizersService.getMyOrganizer(user.id);
  }

  @Patch('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Modifier mon profil organisateur" })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateOrganizerDto,
  ) {
    return this.organizersService.update(user.id, dto);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Tableau de bord organisateur" })
  async getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.organizersService.getDashboard(user.id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: "Profil public d'un organisateur" })
  async findById(@Param('id') id: string) {
    return this.organizersService.findById(id);
  }
}
