import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_PROVIDER,
  PRODUCTCATEGORY_PROVIDER,
  PRODUCT_OPTION_PROVIDER
} from '@/Helpers/contants';
import { Product } from './entities/product.entity';
import { Op } from 'sequelize';
import SpaceFile from '@/Helpers/files';
import { v1 as uuidv1 } from 'uuid';
import { ProductMedia } from './entities/productMedia.entity';
import { ProductOption } from './entities/productOption.entity';
import { ProductCategory } from '../productCategory/entities/productCategory.entity';
import { ProductTag } from '../productTag/entities/productTag.entity';
import { ProductWishlist } from './entities/productWishlist.entity';
@Injectable()
export class ProductsService {
  private spacefile = new SpaceFile();

  constructor(
    @Inject(PRODUCT_PROVIDER)
    private readonly repository: typeof Product,
    @Inject(PRODUCTCATEGORY_PROVIDER)
    private readonly categoryRepository: typeof ProductCategory,
  ) { }

  async findAll(payload): Promise<Product[]> {
    const { q, status, is_published } = payload;

    const filterCondition = {};

    if (q && typeof q === 'string') {
      filterCondition['name'] = { [Op.like]: `%${q}%` };
    }

    if (status) {
      filterCondition['status'] = status;
    }

    if (is_published) {
      filterCondition['is_published'] = is_published;
    }

    return await this.repository.findAll<Product>({
      where: filterCondition,
      order: [['order', 'ASC']],
      include: [
        {
          model: ProductMedia,
        },
        {
          model: ProductOption,
        },
        {
          model: ProductCategory,
        },
      ],
    });
  }

  async sortProduct(payload) {
    console.log(payload);
    for (let index = 0; index < payload.length; index++) {
      const product = payload[index];
      await this.repository.update(
        {
          order: index,
        },
        {
          where: {
            id: product,
          },
        },
      );
    }
  }

  async findOne(id: number) {
    return await this.repository.findOne({
      where: { id: id },
      include: [
        {
          model: ProductMedia,
        },
        {
          model: ProductOption,
        },
        {
          model: ProductTag,
        },
      ],
    });
  }

  async findIdByName(name) {
    return this.repository.findOne({
      where: {
        name,
      },
      attributes: ['id'],
    });
  }

  async findIdBySKU(sku_no) {
    return this.repository.findOne({
      where: {
        sku_no,
      },
      attributes: ['id'],
    });
  }

  async findByName(name) {
    return await this.repository.findOne({
      where: {
        name,
      },
    });
  }

  async isNameExist(name) {
    const total = await this.repository.count({
      where: {
        name: name,
      },
    });
    if (total > 0) {
      return true;
    }
    return false;
  }

  async isSkuExist(sku_no) {
    const total = await this.repository.count({
      where: {
        sku_no,
      },
    });
    if (total > 0) {
      return true;
    }
    return false;
  }

  async getBySKu(sku_no) {
    return await this.repository.findOne({
      where: {
        sku_no,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email: email },
      raw: true,
    });
  }

  async create(payload: any) {
    return await this.repository.create<Product>({ ...payload });
  }

  async update(id: number, payload: any) {
    return await this.repository.update(payload, {
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.repository.destroy({ where: { id } });
  }

  async uploadFiles(files: any) {

    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const { buffer, originalname } = file;

      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'products',
        file.mimetype,
      );
      urls.push(fileObject.Location);
    }
    return urls;
  }


  async findProductStockLimit() {
    return this.repository.findAll({
      where: {
        is_published: 1,
        stock_limit: {
          [Op.gt]: 0,
        },
      },
      attributes: ['id', 'stock_limit'],
      raw: true,
    });
  }

  async getAllHashtags() {
    return this.repository.findAll({
      where: {},
      attributes: ['hashtags'],
      raw: true,
    });
  }

  async import(payload: any) {
    return await this.repository.bulkCreate(payload);
  }
  async generateUpdate(payload) {
    for (const product of payload) {
      await this.repository.update(payload, {
        where: {
          name: product.name,
        },
      });
    }
  }

  async getIdByName(name) {
    return await this.repository.findOne({
      where: {
        name,
      },
      attributes: ['id'],
    });
  }
  async findOrCreateCategoryByName(name) {
    const data = await this.categoryRepository.findOne({
      where: { name },
      raw: true,
    });
    if (data === null) {
      const newCategory = await this.categoryRepository.create({
        name: name,
      });
      return newCategory.id;
    }
    return data.id;
  }
  async isExists(name) {
    const data = await this.repository.findOne({
      where: {
        name,
      },
      raw: true,
    });

    if (data === null) {
      return false;
    }
    return true;
  }
  async updateBySku(payload: any) {
    return await this.repository.update(payload, {
      where: {
        sku_no: payload.sku_no,
      },
    });
  }
}
