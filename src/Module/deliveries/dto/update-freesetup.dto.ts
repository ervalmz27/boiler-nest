import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFreeSetupDto {
  @IsNotEmpty()
  @IsNumber()
  minimum_spend: number;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
