import { Op } from 'sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_PROVIDER } from '@/Helpers/contants';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleCategory } from '../articleCategory/entities/articleCategory.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject(ARTICLE_PROVIDER)
    private readonly repository: typeof Article,
  ) {}

  async findAll(payload: any): Promise<Article[]> {
    const { q = '', category_id, status } = payload;
    const filter = {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${q}%`,
          },
        },
        {
          content: {
            [Op.like]: `%${q}%`,
          },
        },
      ],
    };

    if (typeof category_id !== 'undefined' && category_id !== '') {
      filter['article_category_id'] = category_id;
    }

    filter['status'] = 1;

    if (status && status !== '') {
      filter['status'] = status;
    }

    if (status === 'ALL') {
      delete filter['status'];
    }

    return await this.repository.findAll<Article>({
      order: [['created_at', 'DESC']],
      where: filter,
      include: [{ model: ArticleCategory }],
    });
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: {
        id: id,
      },
      include: [{ model: ArticleCategory }],
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: CreateArticleDto) {
    return await this.repository.create<Article>({
      ...payload,
      raw: true,
    });
  }

  async update(id: number, payload: UpdateArticleDto) {
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
