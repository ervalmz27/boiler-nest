import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto as CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
