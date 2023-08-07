import { Module } from '@nestjs/common';
import { EventCategoriesService } from './eventCategories.service';
import { EventCategorisProvider } from './eventCategories.providers';
import { MemberTiersController } from './eventCategories.controller';

@Module({
  controllers: [MemberTiersController],
  providers: [EventCategoriesService, ...EventCategorisProvider],
})
export class EventCategoryModule {}
