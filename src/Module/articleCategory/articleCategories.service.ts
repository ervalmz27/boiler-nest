import { Inject, Injectable } from '@nestjs/common';
import { ARTICLECATEGORY_PROVIDER } from '@/Helpers/contants';
import { ArticleCategory } from './entities/articleCategory.entity';
import { CreateArticleCategoryDto } from './dto/create-articleCategory.dto';
import { UpdateArticleCategoryDto } from './dto/update-articleCategory.dto';
import { Op } from 'sequelize';

@Injectable()
export class ArticleCategoriesService {
  constructor(
    @Inject(ARTICLECATEGORY_PROVIDER)
    private readonly repository: typeof ArticleCategory,
  ) {}

  async findAll(payload: any): Promise<ArticleCategory[]> {
    const { q } = payload;
    const filter = {
      [Op.or]: [
        {
          name: {
            [Op.substring]: q || '',
          },
        },
        {
          description: {
            [Op.substring]: q || '',
          },
        },
      ],
    };
    return await this.repository.findAll<ArticleCategory>({
      where: filter,
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

  async create(payload: CreateArticleCategoryDto) {
    return await this.repository.create<ArticleCategory>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateArticleCategoryDto) {
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
