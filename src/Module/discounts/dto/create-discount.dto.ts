import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  start_at: string;

  @IsString()
  @IsNotEmpty()
  end_at: string;

  @IsString()
  @IsNotEmpty()
  apply_to: string;

  @IsNumber()
  @IsNotEmpty()
  minimum_spend: number;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  hashtags?: any;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
