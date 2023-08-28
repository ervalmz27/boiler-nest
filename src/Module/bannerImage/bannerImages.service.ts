import { Inject, Injectable } from '@nestjs/common';
import { BANNER_IMAGE_PROVIDER } from '@/Helpers/contants';
import { BannerImage } from './entities/bannerImage.entity';

@Injectable()
export class BannerImagesService {
  constructor(
    @Inject(BANNER_IMAGE_PROVIDER)
    private readonly repository: typeof BannerImage,
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
