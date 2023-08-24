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
import { ProductCategoriesService } from '../productCategory/productCategories.service';
import { allowRunningCron } from '@/Config/generic.config';
import { ProductTagService } from '../productTag/productTag.service';

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
    private readonly tagService: ProductTagService,
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
    const data = await this.service.findOne(+id);
    if (data === null)
      return res.status(404).json({ data, message: 'Data not found' });
    return res.status(200).json({ data, message: 'Data found' });
  }

  //
  @Post()
  async create(@Body() payload: any, @Res() res) {
    const data = await this.service.create(payload);

    await this.optionService.bulkCreate(data.id, payload.options);
    await this.tagService.bulkCreate(data.id, payload.tags);

    return res.status(200).json({ data, message: 'Data Created' });
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

  //
  @Put(':id')
  async update(@Param('id') id: number, @Body() payload: any, @Res() res) {
    try {
      const data = await this.service.findOne(id);
      if (data === null)
        return res.status(404).json({ data, message: 'Data not found' });

      await this.service.update(id, payload);
      await this.optionService.createOrUpdate(id, payload.options);
      await this.optionService.removeOptions(payload.deleted_options);

      const newdata = await this.service.findOne(id);
      return res.status(200).json({ data: newdata, message: 'Data updated' });
    } catch (error) {
      return res
        .status(500)
        .json({ data: null, message: 'Error, ' + error.message });
    }
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
}
