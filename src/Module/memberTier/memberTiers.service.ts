import { Inject, Injectable } from '@nestjs/common';
import { MEMBERTIER_PROVIDER } from '@/Helpers/contants';
import { MemberTier } from './entities/memberTier.entity';
import { CreateMemberTierDto } from './dto/create-memberTier.dto';
import { UpdateMemberTierDto } from './dto/update-memberTier.dto';
import { Op } from 'sequelize';

@Injectable()
export class MemberTiersService {
  constructor(
    @Inject(MEMBERTIER_PROVIDER)
    private readonly repository: typeof MemberTier,
  ) {}

  async findAll(payload: any) {
    const { q } = payload;
    return await this.repository.findAll({
      order: [
        ['is_default', 'DESC'],
        ['name', 'ASC'],
      ],
      where: {
        name: {
          [Op.substring]: q || '',
        },
      },
      raw: true,
    });
  }

  async findByTierId(tierIds) {
    return await this.repository.findAll({
      where: {
        id: tierIds,
      },
      order: [['name', 'asc']],
      raw: true,
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

  async getDefault() {
    const defaultTierData = await this.repository.findOne({
      where: {
        is_default: 1,
      },
      attributes: ['id'],
      raw: true,
    });

    if (defaultTierData === null) {
      const tier = await this.repository.findOne({
        order: ['created_at', 'DESC'],
        raw: true,
      });
      return tier.id;
    }

    return defaultTierData.id;
  }

  async create(payload: CreateMemberTierDto) {
    return await this.repository.create<MemberTier>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateMemberTierDto) {
    return await this.repository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async setAsDefault(id: number) {
    return await this.repository.update(
      { is_default: 0 },
      {
        where: {
          id: {
            [Op.not]: id,
          },
        },
      },
    );
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }
}
