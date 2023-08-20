import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/Helpers/contants';
import { CustomersService } from './customers.service';
import { CustomersProvider } from './customers.providers';
import { CustomersController } from './customers.controller';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '133600s' },
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, NotificationsService, ...CustomersProvider],
  exports: [CustomersService],
})
export class CustomersModule {}
