import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  name_zh: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  description_zh: string;
}
