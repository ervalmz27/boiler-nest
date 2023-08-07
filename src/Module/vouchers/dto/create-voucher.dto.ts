import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  photo: string;

  @IsOptional()
  @IsString()
  point_required: number;

  @IsOptional()
  @IsString()
  type: number;

  @IsOptional()
  @IsString()
  amount: number;

  @IsOptional()
  @IsString()
  expire_in_hour: number;

  @IsOptional()
  @IsString()
  minimum_spend: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  term_condition: string;

  @IsOptional()
  @IsString()
  apply_to: string;

  @IsNotEmpty()
  @IsString()
  status: number;
}
