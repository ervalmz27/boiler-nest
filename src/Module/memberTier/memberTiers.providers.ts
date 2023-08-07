import { MEMBERTIER_PROVIDER, MEMBER_PROVIDER } from '@/Helpers/contants';
import { MemberTier } from './entities/memberTier.entity';
import { Member } from '../member/entities/member.entity';

export const MemberTiersProvider = [
  {
    provide: MEMBERTIER_PROVIDER,
    useValue: MemberTier,
  },
  {
    provide: MEMBER_PROVIDER,
    useValue: Member,
  },
];
