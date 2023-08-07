import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
