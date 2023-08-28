import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsProvider } from './logs.providers';
import { LogsController } from './logs.controller';

@Module({
  controllers: [LogsController],
  providers: [LogsService, ...LogsProvider],
})
export class LogsModule {}
