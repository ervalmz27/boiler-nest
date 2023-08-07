import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  name_zh: string;

  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  description_zh: string;

  @IsOptional()
  terms: string;

  @IsOptional()
  terms_zh: string;

  @IsOptional()
  origins: string;

  @IsOptional()
  origins_zh: string;

  @IsOptional()
  refund_policy: string;

  @IsOptional()
  refund_policy_zh: string;

  @IsOptional()
  sku_no: string;

  @IsOptional()
  stock_limit: string;

  @IsOptional()
  hashtags: string;

  @IsNotEmpty()
  is_published: number;

  @IsOptional()
  options: any;
}
