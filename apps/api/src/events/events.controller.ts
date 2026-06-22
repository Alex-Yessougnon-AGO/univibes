import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, QueryEventsDto } from './dto/create-event.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Liste pagin\u00e9e des \u00e9v\u00e9nements',
    description: 'Retourne une liste pagin\u00e9e des \u00e9v\u00e9nements approuv\u00e9s avec filtres par ville, cat\u00e9gorie, recherche textuelle.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'soir\u00e9e' })
  @ApiQuery({ name: 'city', required: false, type: String, example: 'Cotonou' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String, example: 'approved' })
  @ApiResponse({ status: 200, description: 'Liste des \u00e9v\u00e9nements avec pagination' })
  async findAll(@Query() query: QueryEventsDto) {
    return this.eventsService.findAll(query);
  }

  @Get('cities')
  @Public()
  @ApiOperation({
    summary: 'Liste des villes disponibles',
    description: 'Retourne la liste des villes o\u00f9 des \u00e9v\u00e9nements sont organis\u00e9s, avec le nombre d\'\u00e9v\u00e9nements par ville.',
  })
  @ApiResponse({ status: 200, description: 'Liste des villes' })
  async getCities() {
    return this.eventsService.getCities();
  }

  @Get('search-suggestions')
  @Public()
  @ApiOperation({
    summary: 'Suggestions de recherche',
    description: 'Retourne des suggestions de recherche (titres, villes) pour l\'autocompl\u00e9tion.',
  })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'soi', description: 'Terme de recherche' })
  @ApiResponse({ status: 200, description: 'Suggestions' })
  async searchSuggestions(@Query('q') q: string) {
    return this.eventsService.searchSuggestions(q);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Mes \u00e9v\u00e9nements (organisateur)',
    description: 'Retourne tous les \u00e9v\u00e9nements cr\u00e9\u00e9s par l\'organisateur connect\u00e9.',
  })
  @ApiResponse({ status: 200, description: 'Liste des \u00e9v\u00e9nements de l\'organisateur' })
  async findMy(@CurrentUser() user: AuthenticatedUser) {
    return this.eventsService.findByOrganizer(user.id);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({
    summary: "D\u00e9tails d'un \u00e9v\u00e9nement",
    description: "Retourne les d\u00e9tails complets d'un \u00e9v\u00e9nement par son slug. Incr\u00e9mente le compteur de vues.",
  })
  @ApiParam({ name: 'slug', required: true, type: String, example: 'soiree-de-rentree-uac' })
  @ApiResponse({ status: 200, description: "D\u00e9tails de l'\u00e9v\u00e9nement avec tickets et organisateur" })
  @ApiResponse({ status: 404, description: '\u00c9v\u00e9nement introuvable' })
  async findOne(@Param('slug') slug: string) {
    return this.eventsService.findOne(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Cr\u00e9er un \u00e9v\u00e9nement",
    description: "Cr\u00e9e un nouvel \u00e9v\u00e9nement. L'utilisateur doit \u00eatre organisateur.",
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: '\u00c9v\u00e9nement cr\u00e9\u00e9' })
  @ApiResponse({ status: 403, description: "Vous devez \u00eatre organisateur" })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateEventDto) {
    return this.eventsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Modifier un \u00e9v\u00e9nement" })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: '\u00c9v\u00e9nement mis \u00e0 jour' })
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Supprimer un \u00e9v\u00e9nement" })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200, description: '\u00c9v\u00e9nement supprim\u00e9' })
  async delete(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    await this.eventsService.delete(user.id, id);
    return { message: '\u00c9v\u00e9nement supprim\u00e9 avec succ\u00e8s.' };
  }
}
