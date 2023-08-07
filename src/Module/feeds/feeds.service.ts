import { Inject, Injectable } from '@nestjs/common';
import { FEED_REPOSITORY } from '@/Helpers/contants';
import { Feeds } from './entities/feed.entity';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CreateFeedDTO } from './dto/create-feed.dto';

@Injectable()
export class FeedsService {
  constructor(
    @Inject(FEED_REPOSITORY) private readonly feedRepository: typeof Feeds,
  ) {}

  async findAll(): Promise<Feeds[]> {
    return await this.feedRepository.findAll<Feeds>({});
  }

  async findOne(id: number) {
    return await this.feedRepository.findByPk(id);
  }

  async create(payload: CreateFeedDTO) {
    return await this.feedRepository.create<Feeds>({ ...payload });
  }

  async update(id: number, payload: UpdateFeedDto) {
    return await this.feedRepository.update(
      { ...payload },
      {
        where: { id },
      },
    );
  }

  async remove(id: number) {
    return await this.feedRepository.destroy({ where: { id } });
  }
}
