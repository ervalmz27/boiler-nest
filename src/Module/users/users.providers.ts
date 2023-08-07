import { USER_REPOSITORY } from '@/Helpers/contants';
import { Users } from './entities/user.entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: Users,
  },
];
