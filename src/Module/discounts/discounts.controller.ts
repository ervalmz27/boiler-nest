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
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('discounts')
export class DiscountsController {
  private readonly helpers = new Helpers();
  constructor(private readonly service: DiscountsService) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const { q } = req.query;
    const data = await this.service.findAll(q);
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
  async create(@Body() payload: CreateDiscountDto, @Res() res) {
    const isCodeExists = await this.service.findOne2({
      code: payload.code,
    });
    if (isCodeExists) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Discount code is already exists',
      });
    }

    if (typeof payload.hashtags !== 'undefined') {
      payload.hashtags = JSON.stringify(payload.hashtags);
    }

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
    @Body() payload: UpdateDiscountDto,
    @Res() res,
  ) {
    const discount = await this.service.findOne(id);
    if (discount === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        discount,
      );
    }

    const isCodeExists = await this.service.findOne2({
      code: payload.code,
    });
    if (isCodeExists && isCodeExists.code !== discount.code) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Discount code is already exists',
      });
    }

    if (typeof payload.hashtags !== 'undefined') {
      payload.hashtags = JSON.stringify(payload.hashtags);
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

  @Post('getDiscountByCode')
  async getDiscountByCode(@Body() payload: any, @Res() res) {
    const { code } = payload;
    const discount = await this.service.findByCode(code);
    if (!discount) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Invalid code',
      });
    }

    discount.hashtags = JSON.parse(discount.hashtags);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: discount,
      message: 'Discount found',
    });
  }
}
