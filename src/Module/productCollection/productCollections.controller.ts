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
  UseInterceptors,
  Req,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { v1 as uuidv1 } from 'uuid';
import axios from 'axios';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import SpaceFile from '@/Helpers/files';

import { ProductCollectionsService } from './productCollections.service';
import { ProductCollectionItemsService } from './productCollectionItems.service';
import { ProductsService } from '../product/products.service';

@Controller('product-collections')
export class ProductCollectionsController {
  private readonly logger = new Logger(ProductCollectionsController.name);

  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();
  constructor(
    private readonly service: ProductCollectionsService,
    private readonly itemService: ProductCollectionItemsService,
    private readonly productService: ProductsService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;
    const data = await this.service.findAll(payload);
    if (data.length < 1) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        data,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      data,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const admin = await this.service.findOne(+id);
    if (admin === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        null,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      admin,
    );
  }

  @Get(':id/products')
  async findProduct(@Param('id') id: number, @Res() res) {
    const collectionitems = await this.itemService.findByCollection(+id);
    const returndata = [];
    for (const collection of collectionitems) {
      returndata.push({
        id: collection.id,
        product_collection_id: collection.product_collection_id,
        product_id: collection.product_id,
        product: await this.productService.findOne(collection.product_id),
      });
    }
    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      returndata,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: any,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'product-collections',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
      }
    }
    const data = await this.service.create(payload);

    // TODO store product options
    if (typeof payload.items !== 'undefined') {
      try {
        const items = JSON.parse(payload.items);
        const itemsPayload = [];
        items.forEach((e) => {
          itemsPayload.push({
            product_collection_id: data.id,
            product_id: e,
          });
        });
        await this.itemService.create(itemsPayload);
      } catch (error) {
        this.logger.error('Item payload issue', error.message);
      }
    }

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: any,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'product-collections',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
      }
    }
    const updateData = await this.service.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateData,
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

  @Post(':id/addItem')
  async addItem(@Param('id') id: number, @Body() payload: any, @Res() res) {
    const existingItem = await this.itemService.findByItem({
      product_collection_id: id,
      product_id: payload.product_id,
    });

    if (existingItem.length < 1) {
      const createItem = await this.itemService.create([
        {
          product_collection_id: id,
          product_id: payload.product_id,
        },
      ]);
      return this.helpers.response(
        res,
        HttpStatus.OK,
        RESPONSES.DATA_CREATED,
        createItem,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_CREATED,
      null,
    );
  }

  @Delete('/deleteItem/:id')
  async deleteItem(@Param('id') id: number, @Res() res) {
    const removeData = await this.itemService.remove(+id);
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

  @Post('migrate')
  async migrate(@Res() res) {
    const {
      data: { data },
    } = await axios.get(
      'https://api.gobuddy.asia/buddtrip/v3.0/product_collection/index.php?all=1',
    );

    for (const d of data) {
      await this.service.create({
        id: d.id,
        name: d.name,
        description: null,
        order: d.order,
        is_published: d.is_published,
        image: d.photo,
      });

      let items = [];
      d.detail.forEach((e) => {
        items.push({
          product_collection_id: d.id,
          product_id: e.product_id,
        });
      });
      this.itemService.create(items);
    }
    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      RESPONSES.FAIL_DELETED,
      null,
    );
  }
}
