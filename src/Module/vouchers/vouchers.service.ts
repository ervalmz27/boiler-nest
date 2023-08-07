import { Inject, Injectable } from '@nestjs/common';
import { VOUCHER_PROVIDER } from '@/Helpers/contants';
import { Voucher } from './entities/voucher.entity';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Op } from 'sequelize';

@Injectable()
export class VouchersService {
  constructor(
    @Inject(VOUCHER_PROVIDER)
    private readonly repository: typeof Voucher,
  ) {}

  async findAll(searchKey: string) {
    return await this.repository.findAll({
      order: [['status', 'DESC']],
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: searchKey,
            },
          },
          {
            description: {
              [Op.substring]: searchKey,
            },
          },
        ],
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: CreateVoucherDto) {
    return await this.repository.create<Voucher>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateVoucherDto) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }
}
