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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdsService } from './ads.service';
import { CreateAdDto, UpdateAdDto } from './dto/create-ad.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('ads')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('active')
  @Public()
  @ApiOperation({
    summary: 'Publicit\u00e9s actives',
    description: 'Retourne les publicit\u00e9s actives, filtr\u00e9es optionnellement par ville cible.',
  })
  @ApiQuery({ name: 'city', required: false, type: String, example: 'Cotonou', description: 'Filtrer par ville cible' })
  @ApiResponse({ status: 200, description: 'Liste des publicit\u00e9s actives' })
  async findActive(@Query('city') city?: string) {
    return this.adsService.findActive(city);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Toutes les publicit\u00e9s (admin)',
    description: "Retourne toutes les publicit\u00e9s, actives et inactives. R\u00e9serv\u00e9 aux administrateurs.",
  })
  @ApiResponse({ status: 200, description: 'Liste de toutes les publicit\u00e9s' })
  async findAll() {
    return this.adsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'D\u00e9tails d\'une publicit\u00e9',
    description: "Retourne les d\u00e9tails complets d\'une publicit\u00e9 par son ID. R\u00e9serv\u00e9 aux administrateurs.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la publicit\u00e9' })
  @ApiResponse({ status: 200, description: 'D\u00e9tails de la publicit\u00e9' })
  @ApiResponse({ status: 404, description: 'Publicit\u00e9 introuvable' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adsService.findOne(id);
  }

  @Post()

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cr\u00e9er une publicit\u00e9',
    description: "Cr\u00e9e une nouvelle publicit\u00e9. R\u00e9serv\u00e9 aux administrateurs.",
  })
  @ApiBody({ type: CreateAdDto })
  @ApiResponse({ status: 201, description: 'Publicit\u00e9 cr\u00e9\u00e9e' })
  async create(@Body() dto: CreateAdDto) {
    return this.adsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Modifier une publicit\u00e9',
    description: "Met \u00e0 jour une publicit\u00e9 existante. R\u00e9serv\u00e9 aux administrateurs.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la publicit\u00e9' })
  @ApiBody({ type: UpdateAdDto })
  @ApiResponse({ status: 200, description: 'Publicit\u00e9 mise \u00e0 jour' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAdDto) {
    return this.adsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer une publicit\u00e9',
    description: "Supprime d\u00e9finitivement une publicit\u00e9. R\u00e9serv\u00e9 aux administrateurs.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la publicit\u00e9' })
  @ApiResponse({ status: 200, description: 'Publicit\u00e9 supprim\u00e9e' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.adsService.delete(id);
    return { message: 'Publicit\u00e9 supprim\u00e9e.' };
  }
}
