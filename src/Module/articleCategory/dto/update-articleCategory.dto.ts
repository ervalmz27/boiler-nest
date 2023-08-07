import { PartialType } from '@nestjs/swagger';
import { CreateArticleCategoryDto } from './create-articleCategory.dto';

export class UpdateArticleCategoryDto extends PartialType(
  CreateArticleCategoryDto,
) {}
