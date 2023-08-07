import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDeliveryStatusDto {
  @IsNotEmpty()
  @IsString()
  delivery_status: string;

  @IsOptional()
  delivery_message: string;
}
