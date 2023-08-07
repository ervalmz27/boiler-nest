import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsNotEmpty()
  @IsString()
  payment_status: string;
}
