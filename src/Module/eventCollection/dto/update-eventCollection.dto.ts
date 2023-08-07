import { PartialType } from '@nestjs/swagger';
import { CreateEventCollectionDto } from './create-eventCollection.dto';

export class UpdateEventCollectionDto extends PartialType(
  CreateEventCollectionDto,
) {}
