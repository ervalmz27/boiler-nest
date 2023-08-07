import { PartialType } from '@nestjs/swagger';
import { CreateEventCategoryDto } from './create-eventCategory.dto';

export class UpdateEventCategoryDto extends PartialType(
  CreateEventCategoryDto,
) {}
