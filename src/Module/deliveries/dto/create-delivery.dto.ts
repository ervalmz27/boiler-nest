import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  name_zh: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsOptional()
  description_zh: string;

  @IsNumber()
  price: number;

  @IsNumber()
  is_published: number;

  @IsNumber()
  status: number;
}
