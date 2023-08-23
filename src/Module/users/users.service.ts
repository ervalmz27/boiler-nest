import { Inject, Injectable } from '@nestjs/common';
import { USER_PROVIDER } from '@/Helpers/contants';
import { User } from './entities/users.entity';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_PROVIDER)
    private readonly adminRepository: typeof User,
  ) {}

  async findAll(searchKey: string): Promise<User[]> {
    return await this.adminRepository.findAll<User>({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: searchKey,
            },
          },
          {
            email: {
              [Op.substring]: searchKey,
            },
          },
        ],
      },
    });
  }

  async findOne(id: number) {
    return await this.adminRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.adminRepository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload) {
    return await this.adminRepository.create<User>({ ...payload });
  }

  async update(id, payload) {
    return await this.adminRepository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return await this.adminRepository.destroy({ where: { id } });
  }
}
