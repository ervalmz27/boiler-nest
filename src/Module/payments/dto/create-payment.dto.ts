import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  fee_amount: number;

  @IsOptional()
  @IsNumber()
  fee_percentage: number;

  @IsNotEmpty()
  @IsNumber()
  is_published: number;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
