import {
  MEMBERTIER_PROVIDER,
  MEMBER_PROVIDER,
  MESSAGE_DETAIL_PROVIDER,
  MESSAGE_PROVIDER,
} from '@/Helpers/contants';
import { Messages } from './entities/messages.entity';
import { MessageDetails } from './entities/messageDetail.entity';
import { Member } from '../member/entities/member.entity';
import { MemberTier } from '../memberTier/entities/memberTier.entity';

export const MessagesProvider = [
  {
    provide: MESSAGE_PROVIDER,
    useValue: Messages,
  },
  {
    provide: MESSAGE_DETAIL_PROVIDER,
    useValue: MessageDetails,
  },
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
  {
    provide: MEMBERTIER_PROVIDER,
    useValue: MemberTier,
  },
];
