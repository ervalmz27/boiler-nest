import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { feedsProviders } from './feeds.providers';
import { UsersController } from './feeds.controller';

@Module({
  controllers: [UsersController],
  providers: [FeedsService, ...feedsProviders],
})
export class FeedsModule {}
