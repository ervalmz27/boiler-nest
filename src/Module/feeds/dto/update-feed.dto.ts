import { PartialType } from '@nestjs/swagger';
import { CreateFeedDTO } from './create-feed.dto';

export class UpdateFeedDto extends PartialType(CreateFeedDTO) {}
