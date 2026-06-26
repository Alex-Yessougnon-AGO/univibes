import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { FedaPay, Transaction } from 'fedapay';

@Injectable()
export class FedaPayService {
  private readonly logger = new Logger(FedaPayService.name);
  private readonly configured: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('FEDAPAY_API_KEY');
    const secretKey = this.configService.get<string>('FEDAPAY_SECRET_KEY');
    const isSandbox = this.configService.get<string>('FEDAPAY_SANDBOX') !== 'false';

    if (apiKey && secretKey) {
      FedaPay.setApiKey(secretKey);
      FedaPay.setEnvironment(isSandbox ? 'sandbox' : 'production');
      this.configured = true;
      this.logger.log(`FedaPay configuré (${isSandbox ? 'sandbox' : 'production'})`);
    } else {
      this.configured = false;
      this.logger.warn('FedaPay non configuré — clés manquantes');
    }
  }

  async createTransaction(data: {
    amount: number;
    description: string;
    callbackUrl: string;
    customer?: { email: string; firstname?: string; lastname?: string };
  }) {
    if (!this.configured) {
      this.logger.warn('FedaPay désactivé — transaction simulée');
      return {
        id: `sim_${Date.now()}`,
        url: `${this.configService.get('APP_URL', 'http://localhost:3001')}/checkout/simulated`,
        status: 'pending',
        simulated: true,
      };
    }

    try {
      const transaction = await Transaction.create({
        amount: data.amount,
        description: data.description,
        callback_url: data.callbackUrl,
        customer: data.customer?.email
          ? {
              email: data.customer.email,
              firstname: data.customer.firstname ?? '',
              lastname: data.customer.lastname ?? '',
            }
          : undefined,
      });

      this.logger.log(`Transaction FedaPay créée: ${transaction.id}`);

      return {
        id: transaction.id,
        url: transaction.url,
        status: transaction.status,
        simulated: false,
      };
    } catch (error) {
      this.logger.error(`Erreur FedaPay: ${(error as Error).message}`);
      throw error;
    }
  }

  async verifyWebhook(signature: string, payload: string): Promise<boolean> {
    // Fail-closed : on n'accepte JAMAIS un webhook sans secret partagé.
    // En production FEDAPAY_WEBHOOK_SECRET est obligatoire ; sans lui, tout
    // webhook est rejeté (401).
    const webhookSecret = this.configService.get<string>('FEDAPAY_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.error('FEDAPAY_WEBHOOK_SECRET absent — webhook rejeté (fail-closed)');
      return false;
    }

    try {
      const expected = createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      // timingSafeEqual exige des buffers de même longueur — on vérifie d'abord.
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expected);
      if (sigBuf.length !== expBuf.length || sigBuf.length === 0) {
        return false;
      }
      return timingSafeEqual(sigBuf, expBuf);
    } catch (err) {
      this.logger.warn(`Webhook verification failed: ${(err as Error).message}`);
      return false;
    }
  }
}
