import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesProvider } from './articles.providers';
import { ArticlesController } from './articles.controller';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, ...ArticlesProvider],
})
export class ArticlesModule {}
