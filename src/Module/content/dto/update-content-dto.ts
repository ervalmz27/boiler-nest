import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateAdminDto {
  @IsNotEmpty()
  @MinLength(3)
  content: string;

  @IsOptional()
  contentZh: string;
}
