import { ADMIN_PROVIDER } from '@/Helpers/contants';
import { Admin } from './entities/admin.entity';

export const AdminsProvider = [
  {
    provide: ADMIN_PROVIDER,
    useValue: Admin,
  },
];
