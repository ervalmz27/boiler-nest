import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@/Helpers/contants';
import { MembersService } from './members.service';
import { MembersProvider } from './members.providers';
import { MembersController } from './members.controller';
import { NotificationsService } from '../notifications/notifications.service';
import { MemberTiersService } from '../memberTier/memberTiers.service';
import { CouponsService } from '../coupons/coupons.service';
import { MemberCouponsService } from './memberCoupon.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '133600s' },
    }),
  ],
  controllers: [MembersController],
  providers: [
    MembersService,
    MemberTiersService,
    CouponsService,
    MemberCouponsService,
    NotificationsService,
    ...MembersProvider,
  ],
  exports: [MembersService],
})
export class MembersModule {}
