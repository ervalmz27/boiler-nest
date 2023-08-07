import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginMemberDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  grant_type: string;
}
