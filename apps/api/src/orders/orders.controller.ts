import {
  Controller,
  Get,
  Post,
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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Historique des commandes',
    description: "Retourne l'historique des commandes de l'utilisateur connect\u00e9, avec les d\u00e9tails des \u00e9v\u00e9nements, billets et paiements.",
  })
  @ApiResponse({ status: 200, description: 'Liste des commandes' })
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: "D\u00e9tails d'une commande",
    description: "Retourne les d\u00e9tails complets d'une commande avec les billets \u00e9mis et les informations de paiement.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'D\u00e9tails de la commande' })
  @ApiResponse({ status: 404, description: 'Commande introuvable' })
  async findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cr\u00e9er une commande',
    description: "Cr\u00e9e une nouvelle commande pour un \u00e9v\u00e9nement. V\u00e9rifie les stocks des billets et d\u00e9cr\u00e9mente les quantit\u00e9s disponibles.",
  })
  @ApiBody({ type: CreateOrderDto, description: "Items de la commande" })
  @ApiResponse({ status: 201, description: 'Commande cr\u00e9\u00e9e' })
  @ApiResponse({ status: 400, description: 'Stock insuffisant ou \u00e9v\u00e9nement non disponible' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(user.id, dto);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Annuler une commande',
    description: "Annule une commande en statut pending et remet les stocks \u00e0 disposition.",
  })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande annul\u00e9e' })
  @ApiResponse({ status: 400, description: 'Commande ne peut plus \u00eatre annul\u00e9e' })
  async cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.ordersService.cancelOrder(id, user.id);
    return { message: 'Commande annul\u00e9e.' };
  }
}
