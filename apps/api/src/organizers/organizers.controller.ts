import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
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
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Devenir organisateur',
    description: "Permet \u00e0 un utilisateur \u00e9tudiant de cr\u00e9er un profil organisateur. Le r\u00f4le de l'utilisateur est automatiquement mis \u00e0 jour.",
  })
  @ApiBody({ type: CreateOrganizerDto, description: "Informations de l'organisation" })
  @ApiResponse({ status: 201, description: 'Profil organisateur cr\u00e9\u00e9' })
  @ApiResponse({ status: 409, description: 'D\u00e9j\u00e0 organisateur' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrganizerDto,
  ) {
    return this.organizersService.create(user.id, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mon profil organisateur',
    description: "Retourne le profil organisateur de l'utilisateur connect\u00e9 avec ses \u00e9v\u00e9nements et boosts.",
  })
  @ApiResponse({ status: 200, description: 'Profil organisateur' })
  @ApiResponse({ status: 404, description: "Vous n'\u00eates pas organisateur" })
  async getMy(@CurrentUser() user: AuthenticatedUser) {
    return this.organizersService.getMyOrganizer(user.id);
  }

  @Patch('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Modifier mon profil organisateur',
    description: "Met \u00e0 jour les informations du profil organisateur.",
  })
  @ApiBody({ type: UpdateOrganizerDto })
  @ApiResponse({ status: 200, description: 'Profil mis \u00e0 jour' })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateOrganizerDto,
  ) {
    return this.organizersService.update(user.id, dto);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Tableau de bord organisateur',
    description: "Retourne les statistiques du tableau de bord : nombre d'\u00e9v\u00e9nements, vues, commandes r\u00e9centes.",
  })
  @ApiResponse({ status: 200, description: 'Statistiques du tableau de bord' })
  async getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.organizersService.getDashboard(user.id);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: "Profil public d'un organisateur",
    description: "Retourne les informations publiques d'un organisateur avec ses \u00e9v\u00e9nements approuv\u00e9s.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: "ID de l'organisateur" })
  @ApiResponse({ status: 200, description: 'Profil public' })
  @ApiResponse({ status: 404, description: 'Organisateur introuvable' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizersService.findById(id);
  }
}
