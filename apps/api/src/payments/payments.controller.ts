import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  Req,
  UnauthorizedException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { FedaPayService } from './fedapay.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/initiate-payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly fedapay: FedaPayService,
  ) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Initier un paiement',
    description: "Initie un paiement via FedaPay ou Kkiapay. Retourne l'URL de redirection pour effectuer le paiement.",
  })
  @ApiBody({ type: InitiatePaymentDto })
  @ApiResponse({ status: 201, description: 'Paiement initi\u00e9, URL de redirection fournie' })
  @ApiResponse({ status: 404, description: 'Commande introuvable' })
  @ApiResponse({ status: 400, description: 'Moyen de paiement non support\u00e9 ou commande d\u00e9j\u00e0 pay\u00e9e' })
  async initiate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiate(user.id, dto);
  }

  @Post('webhook')
  @Public()
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Webhook de paiement',
    description:
      "Endpoint pour recevoir les notifications de statut de paiement depuis FedaPay/Kkiapay. Vérifie la signature HMAC puis met à jour le statut de la commande et génère les billets.",
  })
  @ApiBody({ type: PaymentWebhookDto })
  @ApiResponse({ status: 201, description: 'Webhook re\u00e7u' })
  @ApiResponse({ status: 401, description: 'Signature invalide' })
  async webhook(
    @Req() req: Request,
    @Headers() headers: Record<string, string>,
    @Body() dto: PaymentWebhookDto,
  ) {
    // Sécurité (P0-2) : vérification de la signature HMAC FedaPay.
    // Le secret FEDAPAY_WEBHOOK_SECRET est obligatoire en production.
    const signature =
      headers['x-fedapay-signature'] ??
      headers['x-fEDAPAY-Signature'] ??
      '';

    // rawBody est peuplé par `verify: 'webhook'"` (NestFactory raw body).
    const raw =
      (req as unknown as { rawBody?: Buffer }).rawBody?.toString('utf8') ??
      JSON.stringify(dto);

    const valid = await this.fedapay.verifyWebhook(signature, raw);
    if (!valid) {
      this.logger.warn(`Webhook rejeté — signature invalide`);
      throw new UnauthorizedException({ code: 'INVALID_SIGNATURE' });
    }

    await this.paymentsService.handleWebhook(dto);
    return { received: true };
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Statut du paiement',
    description: "Retourne le statut du paiement pour une commande donn\u00e9e.",
  })
  @ApiParam({ name: 'orderId', required: true, type: String, description: 'ID de la commande' })
  @ApiResponse({ status: 200, description: 'D\u00e9tails du paiement' })
  async getStatus(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentStatus(orderId);
  }
}
