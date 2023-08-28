import { Inject, Injectable } from '@nestjs/common';
import { NEWS_PROVIDER } from '@/Helpers/contants';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @Inject(NEWS_PROVIDER)
    private readonly repository: typeof News,
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
