import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Req,
  Body,
  Delete,
  Post,
  Put,
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ProductCategoriesService } from './productCategories.service';
import { CreateProductCategoryDto } from './dto/create-productCategory.dto';
import { UpdateProductCategoryDto } from './dto/update-productCategory.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  private readonly helpers = new Helpers();
  constructor(private readonly service: ProductCategoriesService) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;
    const data = await this.service.findAll(payload);
    if (data.length < 1) {
      return res.status(404).json({ data, message: 'Data not found' });
    }

    return res.status(200).json({ data, message: 'Data found' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const admin = await this.service.findOne(+id);
    if (admin === null) {
      return res
        .status(404)
        .response({ data: null, message: 'Data not found' });
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      admin,
    );
  }

  @Post()
  async create(@Body() payload: CreateProductCategoryDto, @Res() res) {
    const data = await this.service.create(payload);

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateProductCategoryDto,
    @Res() res,
  ) {
    const PAYMENT = await this.service.findOne(id);
    if (PAYMENT === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        PAYMENT,
      );
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
}
