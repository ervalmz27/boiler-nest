import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersProvider } from './users.providers';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...UsersProvider],
  exports: [UsersService],
})
export class UsersModule {}
