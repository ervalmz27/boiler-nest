import { Inject, Injectable } from '@nestjs/common';
import { ADMIN_PROVIDER } from '@/Helpers/contants';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Op } from 'sequelize';

@Injectable()
export class AdminsService {
  constructor(
    @Inject(ADMIN_PROVIDER)
    private readonly adminRepository: typeof Admin,
  ) {}

  async findAll(searchKey: string): Promise<Admin[]> {
    return await this.adminRepository
      .findAll<Admin>({
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
      })
      .then((result) => {
        return result.map((e) => {
          e.page_access = JSON.parse(e.page_access);
          return e;
        });
      });
  }

  async findOne(id: number) {
    return await this.adminRepository
      .findOne({
        where: {
          id,
        },
      })
      .then((result) => {
        result.page_access = JSON.parse(result.page_access);
        return result;
      });
  }

  async findByEmail(email: string) {
    return await this.adminRepository
      .findOne({
        where: { email: email },
        raw: true,
      })
      .then((result) => {
        if (result === null) {
          return null;
        }
        result.page_access =
          result.page_access && result.page_access === null
            ? []
            : JSON.parse(result.page_access);
        return result;
      });
  }

  async create(payload: CreateAdminDto) {
    return await this.adminRepository.create<Admin>({ ...payload });
  }

  async update(id: number, payload: UpdateAdminDto) {
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
