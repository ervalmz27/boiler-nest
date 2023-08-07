import { Module } from '@nestjs/common';
import { ProductSavedService } from './productSaved.service';
import { ProductSavedProvider } from './productSaved.providers';
import { ProductSavedController } from './productSaved.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/Helpers/contants';
import { MembersService } from '../member/members.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '133600s' },
    }),
  ],
  controllers: [ProductSavedController],
  providers: [ProductSavedService, MembersService, ...ProductSavedProvider],
})
export class ProductSavedModule {}
