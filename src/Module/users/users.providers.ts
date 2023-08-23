import { USER_PROVIDER } from '@/Helpers/contants';
import { User } from './entities/users.entity';

export const UsersProvider = [
  {
    provide: USER_PROVIDER,
    useValue: User,
  },
];
