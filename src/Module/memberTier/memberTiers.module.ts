import { Module } from '@nestjs/common';
import { MemberTiersService } from './memberTiers.service';
import { MemberTiersProvider } from './memberTiers.providers';
import { MemberTiersController } from './memberTiers.controller';
import { MembersService } from '../member/members.service';

@Module({
  controllers: [MemberTiersController],
  providers: [MemberTiersService, MembersService, ...MemberTiersProvider],
})
export class MemberTierModule {}
