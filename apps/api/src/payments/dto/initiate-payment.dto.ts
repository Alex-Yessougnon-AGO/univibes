import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty()
  @IsUUID()
  orderId!: string;

  @ApiProperty({ example: 'fedapay' })
  @IsString()
  provider!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  successUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cancelUrl?: string;
}

export class PaymentWebhookDto {
  @ApiProperty()
  @IsString()
  provider!: string;

  @ApiProperty()
  @IsString()
  providerReference!: string;

  @ApiProperty({ example: 'success' })
  @IsString()
  status!: string;
}
