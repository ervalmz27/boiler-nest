import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsProvider } from './contents.providers';
import { ContentsController } from './contents.controller';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService, ...ContentsProvider],
})
export class ContentsModule {}
