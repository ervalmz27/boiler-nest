import { PartialType } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './create-productCategory.dto';

export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto,
) {}
