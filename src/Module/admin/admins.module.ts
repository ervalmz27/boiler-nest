import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsProvider } from './admins.providers';
import { AdminsController } from './admins.controller';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService, ...AdminsProvider],
  exports: [AdminsService],
})
export class AdminsModule {}
