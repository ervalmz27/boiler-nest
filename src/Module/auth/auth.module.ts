import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminsModule } from '../admin/admins.module';
import { jwtConstants } from '@/Helpers/contants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AdminsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '133600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
