import { Module, forwardRef } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { FedaPayService } from './fedapay.service';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, FedaPayService],
  exports: [PaymentsService, FedaPayService],
})
export class PaymentsModule {}
