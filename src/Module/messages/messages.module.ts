import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesProvider } from './messages.providers';
import { MessagesController } from './messages.controller';
import { MessageDetailsService } from './messageDetails.service';
import { MembersService } from '../member/members.service';
import { MemberTiersService } from '../memberTier/memberTiers.service';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessageDetailsService,
    MembersService,
    MemberTiersService,
    ...MessagesProvider,
  ],
})
export class MessageModule {}
