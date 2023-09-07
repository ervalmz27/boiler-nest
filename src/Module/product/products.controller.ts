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
  Logger,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ProductsService } from './products.service';
import { ProductMediasService } from './productMedias.service';
import { ProductOptionsService } from './productOptions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ProductCategoriesService } from '../productCategory/productCategories.service';
import { ProductTagService } from '../productTag/productTag.service';
import { ProductWishlistService } from './services/productWishlist.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import SpaceFile from '@/Helpers/files';
import { v1 as uuidv1 } from 'uuid';
const xlsx = require('xlsx');
@Controller('products')
export class ProductsController {
  private readonly helpers = new Helpers();

  constructor(
    private readonly service: ProductsService,
    private readonly optionService: ProductOptionsService,
    private readonly tagService: ProductTagService,
    private readonly mediaService: ProductMediasService,
    private readonly spaceFile: SpaceFile,
    private readonly wishlistService: ProductWishlistService,
  ) { }

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
    const counts = await this.service.count(+id);
    data.dataValues.Inventory_ordered = counts
    if (data === null)
      return res.status(404).json({ data, message: 'Data not found' });
    return res.status(200).json({ data, message: 'Data found' });
  }

  @Post()
  async create(@Body() payload: any, @Res() res) {
    const data = await this.service.create(payload);

    await this.optionService.bulkCreate(data.id, payload.options);
    await this.tagService.bulkCreate(data.id, payload.tags);
    await this.mediaService.bulkCreate(data.id, payload.images)
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

  //
  @Post('getCustomerWishlist')
  async getCustomerWishList(@Body() payload, @Res() res) {
    const { customer_id } = payload;
    const data = await this.wishlistService.getWishListByCustomer(customer_id);
    return res.status(200).json({ data });
  }

  //
  @Post('deleteCustomerWishlist')
  async deleteCustomerWishList(@Body() payload, @Res() res) {
    const { id, customer_id } = payload;
    const data = await this.wishlistService.deleteCustomerWishlist(
      id,
      customer_id,
    );
    return res.status(200).json({ data });
  }
  @Post('imageUpload')
  @UseInterceptors(FilesInterceptor('photos'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.service.uploadFiles(files)
  }
  @Post('videoUpload')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    const fileName = uuidv1() + '.' + file.originalname.split('.').pop();
    const result: any = await this.spaceFile.uploadObject(file.buffer, fileName)
    const { Location } = result
    return Location
  }
  @Post('import')
  @UseInterceptors(FileInterceptor('doc'))
  async import(@Res() res, @UploadedFile() file: Express.Multer.File) {
    const { buffer } = file;
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Assuming you want to convert the first sheet
    const optionSheetName = workbook.SheetNames[1]; // Assuming you want to convert the first sheet

    const worksheet = workbook.Sheets[sheetName];
    const worksheet2 = workbook.Sheets[optionSheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      raw: true,
      cellText: false,
    });

    const jsonDataOpt = xlsx.utils.sheet_to_json(worksheet2, {
      raw: true,
      cellText: false,
    });

    const newProductArray = [];
    const existingProduct = [];

    //  Handle Product data
    for (let index = 0; index < jsonData.length; index++) {
      const product = jsonData[index];
      const isProductExists = await this.service.isExists(product['Name']);

      const payload = {
        name: product['Name'],
        category_id: await this.service.findOrCreateCategoryByName(
          product['Category'],
        ),
        description: product['Description'],
        terms: product['Term and Condition'],
        origins: product['Origins'],
        stock_limit: product['Stock Limit'],
        refund_policy: product['Refund Policy'],
        link: product['Link'],
        is_exists: true,
      };
      if (!isProductExists) {
        newProductArray.push(payload);
      } else {
        existingProduct.push(payload);
      }
    }

    await this.service.import(newProductArray);
    await this.service.generateUpdate(existingProduct);

    //  Handle Product Options
    const newOptions = [];
    const existingOptions = [];
    for (let index = 0; index < jsonDataOpt.length; index++) {
      const option = jsonDataOpt[index];
      const optionExists = await this.optionService.findBySku(option['SKU No']);
      const product = await this.service.getIdByName(option['Product Name']);

      if (product !== null) {
        const payload = {
          product_id: product?.id || null,
          name: option['Option Name'] || ' ',
          sku_no: option['SKU No'] ? option['SKU No'] + '' : null,
          quantity: option['Stock'] || 0,
          list_price: option['List Price'] || 0,
          selling_price: option['Selling Price'] || 0,
          weight: option['Weight'] || '1',
          weight_unit: option['Weight Unit']
            ? option['Weight Unit'].toUpperCase()
            : 'KG',
          status: 1,
        };
        if (optionExists) {
          newOptions.push(payload);
        } else {
          existingOptions.push(payload);
        }
      }
    }

    await this.optionService.import(newOptions);
    await this.optionService.importUpdate(existingOptions);
    return res.json({
      data: newProductArray || existingOptions,
      options: {
        new: newOptions,
        exist: existingOptions,
      },
    });
  }
}