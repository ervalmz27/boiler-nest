import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductCollectionDto {
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  order: number;

  @IsOptional()
  image: any;

  @IsOptional()
  @IsNumber()
  is_published: number;
}
