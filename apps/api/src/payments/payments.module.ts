import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { FedaPayService } from './fedapay.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, FedaPayService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
