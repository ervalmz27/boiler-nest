import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_PROVIDER } from '@/Helpers/contants';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentsService {
  constructor(
    @Inject(CONTENT_PROVIDER)
    private readonly repository: typeof Content,
  ) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id) {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async create(payload) {
    return await this.repository.create(payload);
  }

  async update(id, payload) {
    return await this.repository.update(payload, { where: { id } });
  }

  async remove(id) {
    return await this.repository.destroy({ where: { id } });
  }
}
