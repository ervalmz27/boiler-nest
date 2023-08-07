import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOnlinePaymentDto {
  @IsString()
  @IsOptional()
  stripe_public_key: string;

  @IsString()
  @IsOptional()
  stripe_secret_key: string;

  @IsString()
  @IsOptional()
  stripe_webhook_key: string;

  @IsString()
  @IsOptional()
  pa_merchant_key: string;

  @IsString()
  @IsOptional()
  pa_secret_key: string;

  @IsNumber()
  @IsOptional()
  pa_enable_alipay: number;

  @IsNumber()
  @IsOptional()
  pa_enable_wechat: number;

  @IsNumber()
  @IsOptional()
  pa_enable_union: number;

  @IsString()
  @IsOptional()
  payme_client_id: string;

  @IsString()
  @IsOptional()
  payme_secret_key_id: string;

  @IsString()
  @IsOptional()
  payme_signing_key_id: string;

  @IsString()
  @IsOptional()
  payme_signing_key: string;

  @IsNumber()
  @IsOptional()
  fee_percentage: number;

  @IsNumber()
  @IsOptional()
  fee_amount: number;

  @IsNumber()
  @IsOptional()
  fee_percentage_wechat: number;

  @IsNumber()
  @IsOptional()
  fee_amount_wechat: number;

  @IsNumber()
  @IsOptional()
  fee_percentage_alipay: number;

  @IsNumber()
  @IsOptional()
  fee_amount_alipay: number;

  @IsNumber()
  @IsOptional()
  @IsIn([0, 1])
  status: number;
}
