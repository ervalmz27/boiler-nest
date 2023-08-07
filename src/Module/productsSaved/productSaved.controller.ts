import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Body,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ProductSavedService } from './productSaved.service';
import { CreateSavedProductDto } from './dto/createSavedProduct.dto';
import { XAuthGuards } from '../auth/xauth.guard';
import { MembersService } from '../member/members.service';

@Controller('product-saved')
export class ProductSavedController {
  private readonly helpers = new Helpers();
  constructor(
    private readonly service: ProductSavedService,
    private readonly memberService: MembersService,
  ) {}

  @Get()
  @UseGuards(XAuthGuards)
  async findAll(@Request() req, @Res() res) {
    const { user } = req;

    const payload = {
      member_id: user.id,
    };
    const data = await this.service.findAllNested(payload);
    const products = data.map((e) => e.product);
    if (data.length < 1) {
      return this.helpers.responseJson(
        res,
        false,
        [],
        'Product not found',
        404,
      );
    }

    return this.helpers.responseJson(
      res,
      true,
      products,
      'Product Found',
      HttpStatus.OK,
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

  @UseGuards(XAuthGuards)
  @Post()
  async create(
    @Body() payload: CreateSavedProductDto,
    @Res() res,
    @Request() req,
  ) {
    const { user } = req;
    const newPayload = {
      ...payload,
      member_id: user.id,
    };
    const isSaved = await this.service.isProductSaved({
      product_id: payload.product_id,
      member_id: user.id,
    });
    if (isSaved) {
      return this.helpers.responseJson(
        res,
        false,
        null,
        'Product already saved.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.service.upsert(newPayload);
    return this.helpers.responseJson(
      res,
      true,
      null,
      'Success add saved product.',
      HttpStatus.OK,
    );
  }

  @UseGuards(XAuthGuards)
  @Post('/delete')
  async remove(@Body() payload: any, @Res() res, @Request() req) {
    const { user } = req;
    const removeData = await this.service.remove({
      member_id: user.id,
      product_id: payload.product_id,
    });
    if (removeData > 0) {
      return this.helpers.responseJson(res, true);
    }

    return this.helpers.responseJson(
      res,
      false,
      null,
      'Success delete saved product',
      HttpStatus.BAD_REQUEST,
    );
  }
}
