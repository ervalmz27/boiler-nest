import { Inject, Injectable, Logger } from '@nestjs/common';
import { PRODUCTCATEGORY_PROVIDER } from '@/Helpers/contants';
import { ProductCategory } from './entities/productCategory.entity';
import { CreateProductCategoryDto } from './dto/create-productCategory.dto';
import { UpdateProductCategoryDto } from './dto/update-productCategory.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductCategoriesService {
  private readonly logger = new Logger(ProductCategoriesService.name);

  constructor(
    @Inject(PRODUCTCATEGORY_PROVIDER)
    private readonly repository: typeof ProductCategory,
  ) {}

  async findAll(payload: any): Promise<ProductCategory[]> {
    const { q } = payload;

    return await this.repository.findAll<ProductCategory>({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.substring]: q,
            },
          },
          {
            description: {
              [Op.substring]: q,
            },
          },
        ],
      },
    });
  }

  async findOne(id: number) {
    return await this.repository.findByPk(id);
  }

  async findByName(name) {
    return await this.repository.findOne({
      where: {
        name,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: CreateProductCategoryDto) {
    return await this.repository
      .create<ProductCategory>({
        ...payload,
        raw: true,
      })
      .catch((err) => this.logger.error(err.message));
  }

  async findAndCreate(payload) {
    const category = await this.repository.findOne({
      where: {
        name: payload.name,
      },
    });

    if (category === null) {
      return await this.repository.create({
        name: payload.name,
      });
    }

    return category;
  }

  async upsert(payload: CreateProductCategoryDto) {
    return this.repository
      .findOne({
        where: {
          name: payload.name,
        },
      })
      .then((result) => {
        if (result === null) {
          return this.repository.create({
            name: payload.name,
          });
        }
        return result;
      });
  }

  async update(id: number, payload: UpdateProductCategoryDto) {
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
