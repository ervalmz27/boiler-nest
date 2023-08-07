import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Body,
  Delete,
  Post,
  Put,
  Req,
  UseInterceptors,
  UploadedFiles,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
import axios from 'axios';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductMediasService } from './productMedias.service';
import { ProductOptionsService } from './productOptions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TEMPLATE_ID } from '@/Helpers/contants/sengridtemplate';
import { EventsService } from '../event/events.service';
import { ProductCategoriesService } from '../productCategory/productCategories.service';
import { allowRunningCron } from '@/Config/generic.config';

@Controller('products')
export class ProductsController {
  private readonly helpers = new Helpers();
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    private readonly service: ProductsService,
    private readonly mediaService: ProductMediasService,
    private readonly optionService: ProductOptionsService,
    private readonly categoryService: ProductCategoriesService,
    private readonly notificationService: NotificationsService,
    private readonly eventService: EventsService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const user = await this.service.findAll(req.query);
    if (user.length < 1) {
      return this.helpers.responseJson(
        res,
        true,
        user,
        'Product not found',
        404,
      );
    }

    return this.helpers.responseJson(
      res,
      true,
      user,
      'Product data found',
      200,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const product = await this.service.findOne(+id);
    if (product === null) {
      return this.helpers.responseJson(
        res,
        true,
        null,
        'Product not found',
        404,
      );
    }

    return this.helpers.responseJson(
      res,
      true,
      product,
      'Product data found',
      200,
    );
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 10 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async create(
    @Body() payload: CreateProductDto,
    @Res() res,
    @UploadedFiles()
    files: {
      photos?: Express.Multer.File[];
      video?: Express.Multer.File;
    },
  ) {
    const data = await this.service.create(payload);

    if (typeof files.photos !== 'undefined') {
      const photos = await this.service.uploadFiles(files.photos);
      await this.mediaService.create(data.id, photos, 'image');
    }

    if (typeof files.video !== 'undefined') {
      const videos = await this.service.uploadFiles(files.video);
      await this.mediaService.create(data.id, videos, 'video');
    }

    const productOptions = JSON.parse(payload.options);
    await this.optionService.bulkCreate(data.id, productOptions);

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Post('/sortProduct')
  async sortProduct(@Body() payload: any, @Res() res) {
    const data = await this.service.sortProduct(payload);
    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Post('/addOptions')
  async addOptions(@Body() payload: any, @Res() res) {
    const data = await this.optionService.create(payload);
    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Post('/updateOptions')
  async updateOptons(@Body() payload: any, @Res() res) {
    const data = await this.optionService.update(payload);
    return res.status(HttpStatus.OK).json({
      data: data,
      message: 'Option Updated',
    });
  }

  @Post('/deleteOption')
  async deleteOption(@Body() payload: any, @Res() res) {
    const { id } = payload;
    const data = await this.optionService.remove(id);
    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_DELETED,
      data,
    );
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 10 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: number,
    @Body() payload: any,
    @Res() res,
    @UploadedFiles()
    files: {
      photos?: Express.Multer.File[];
      video?: Express.Multer.File;
    },
  ) {
    const product = await this.service.findOne(id);
    if (product === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        product,
      );
    }

    console.log(payload.images);
    const updateProduct = await this.service.update(+id, payload);

    if (payload.images) {
      const images = JSON.parse(payload.images);
      await this.mediaService.truncateMediasByProduct(id);
      await this.mediaService.create(id, images);
    }

    if (typeof files.video !== 'undefined') {
      const videos = await this.service.uploadFiles(files.video);
      await this.mediaService.create(id, videos, 'video');
    }

    if (typeof payload.deleted_medias !== 'undefined') {
      await this.mediaService.deleteFiles(payload.deleted_medias);
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateProduct,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const removeData = await this.service.remove(+id);
    if (removeData > 0) {
      return this.helpers.response(res, HttpStatus.OK, RESPONSES.DATA_DELETED, {
        deletedId: id,
      });
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      RESPONSES.FAIL_DELETED,
      null,
    );
  }

  @Post('/getProductEventHashtags')
  async getAllHashtags(@Res() res) {
    const producthashtags = await this.service.getAllHashtags();
    const eventhashtags = await this.eventService.getAllHashtags();
    let ret = [];
    producthashtags.forEach((e) => {
      if (e.hashtags !== null) {
        const hashtags = e.hashtags.split(',');
        hashtags.forEach((h) => {
          ret.push(h);
        });
      }
    });

    eventhashtags.forEach((e) => {
      if (e.hashtags !== null) {
        const hashtags = e.hashtags.split(',');
        hashtags.forEach((h) => {
          ret.push(h);
        });
      }
    });

    return this.helpers.response(res, HttpStatus.OK, RESPONSES.DATA_FOUND, [
      ...new Set(ret),
    ]);
  }

  @Post('getProductHashtags')
  async getProductHashtags(@Res() res, @Req() req) {
    const hashtags = await this.service.getAllHashtags();
    const ret = [];
    hashtags.forEach((e) => {
      if (e.hashtags !== null) {
        const hashtags = e.hashtags.split(',');
        hashtags.forEach((h) => {
          if (h.trim() !== '') {
            ret.push({
              tag: h,
            });
          }
        });
      }
    });
    return this.helpers.responseJson(res, true, ret, 'Hashtags Found');
  }

  @Post('migrate')
  async migrateProduct(@Res() res) {
    const {
      data: { data },
    } = await axios.get(
      'https://api.gobuddy.asia/buddtrip/v3.0/product/migrate.php',
    );

    for (const e of data) {
      try {
        let categoryId = null;
        if (e.category !== '') {
          const category = await this.categoryService.upsert({
            name: e.category,
            description: e.category,
          });
          categoryId = category.id;
        }
        await this.service.create({
          id: e.id,
          name: e.name,
          name_zh: e.name,
          category_id: categoryId,
          description: e.description,
          description_zh: e.description,
          terms: e.terms,
          terms_zh: e.terms,
          refund_policy: e.refund_policy,
          refund_policy_zh: e.refund_policy,
          origins: e.origins,
          origins_zh: e.origins,
          sku_no: e.sku_no || '-',
          stock_limit: e.stock_limit || 0,
          hashtags: e.hashtag.map((e) => e.tag).join(','),
          status: e.status,
          is_published: e.is_published,
        });
        this.optionService.bulkCreate(e.id, e.options);
        this.mediaService.bulkCreate(e.id, e.photos);
      } catch (error) {
        this.logger.error(error.message);
      }
    }
    return this.helpers.responseJson(res, true, data, 'Hashtags Found');
  }

  @Post('imageUpload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 10 }]))
  async imageUpload(
    @Body() payload: any,
    @Res() res,
    @UploadedFiles()
    files: {
      photos?: Express.Multer.File[];
    },
  ) {
    let uploadedPhotos = [];
    if (typeof files.photos !== 'undefined') {
      const photos = await this.service.uploadFiles(files.photos);
      uploadedPhotos = photos;
    }

    return res
      .status(uploadedPhotos.length < 1 ? HttpStatus.NOT_FOUND : HttpStatus.OK)
      .json({
        data: uploadedPhotos,
      });
  }
}
