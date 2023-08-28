import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsProvider } from './news.providers';
import { NewsController } from './news.controller';

@Module({
  controllers: [NewsController],
  providers: [NewsService, ...NewsProvider],
})
export class NewsModule {}
