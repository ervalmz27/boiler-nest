import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  title_zh: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsNotEmpty()
  @IsString()
  article_category_id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  content_zh: string;

  @IsString()
  status: string;

  @IsString()
  send_notification: string;
}
