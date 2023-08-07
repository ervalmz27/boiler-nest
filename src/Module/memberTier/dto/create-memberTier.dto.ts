import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberTierDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsOptional()
  excluded_hashtags: any;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  is_default: number;
}
