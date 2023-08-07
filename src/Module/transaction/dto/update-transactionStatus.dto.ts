import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionStatusDto {
  @IsNotEmpty()
  @IsString()
  order_status: string;
}
