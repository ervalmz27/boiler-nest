import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  category_birthday_month: any;

  @IsNotEmpty()
  @IsNumber()
  expiry: number;

  @IsNotEmpty()
  @IsString()
  coupon_type: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  minimum_spend: number;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  campaign_start: string;

  @IsNotEmpty()
  @IsString()
  campaign_end: string;

  @IsNotEmpty()
  tiers: any;

  @IsNotEmpty()
  @IsString()
  apply_to: string;

  @IsOptional()
  product_id: string;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
