import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  @IsString()
  item_type: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  product_id: string;

  @IsOptional()
  @IsString()
  product_option_id: string;

  @IsOptional()
  @IsString()
  event_id: string;

  @IsOptional()
  @IsString()
  event_detail_id: string;

  @IsOptional()
  @IsString()
  ticket_option_id: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
