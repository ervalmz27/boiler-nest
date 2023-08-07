import { Inject, Injectable } from '@nestjs/common';
import { CONTENT_PROVIDER } from '@/Helpers/contants';
import { Content } from './entities/content.entity';
import { UpdateAdminDto } from './dto/update-content-dto';

@Injectable()
export class ContentsService {
  constructor(
    @Inject(CONTENT_PROVIDER)
    private readonly repository: typeof Content,
  ) {}

  async findAll(): Promise<Content[]> {
    return await this.repository.findAll<Content>({});
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async findByType(type: string) {
    return await this.repository.findOne({
      where: {
        page_type: type,
      },
    });
  }

  async create(payload: any) {
    return await this.repository.create<Content>({ ...payload });
  }

  async upsert(type: string, payload: any) {
    return await this.repository
      .findOne({
        where: {
          page_type: type,
        },
      })
      .then((result) => {
        if (result === null) {
          return this.repository.create({
            page_type: type,
            content: payload.content,
            content_zh: payload.contentZh,
          });
        }
        return result;
      })
      .then((result) => {
        if (result !== null) {
          return this.repository.update(
            {
              content: payload.content,
              content_zh: payload.contentZh,
            },
            {
              where: { page_type: type },
            },
          );
        }
      });
  }

  async update(type: string, payload: UpdateAdminDto) {
    return await this.repository
      .findOne({
        where: {
          page_type: type,
        },
      })
      .then((result) => {
        if (result === null) {
        } else {
          return this.repository.update(
            {
              content: payload.content,
              content_zh: payload.contentZh,
            },
            {
              where: { page_type: type },
            },
          );
        }
      });
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }
}
