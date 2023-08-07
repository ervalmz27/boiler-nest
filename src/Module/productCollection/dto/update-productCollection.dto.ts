import { PartialType } from '@nestjs/swagger';
import { CreateProductCollectionDto } from './create-productCollection.dto';

export class UpdateProductCollectionDto extends PartialType(
  CreateProductCollectionDto,
) {}
