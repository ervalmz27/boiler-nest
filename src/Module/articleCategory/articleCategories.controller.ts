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

import { ApiOperation } from '@nestjs/swagger';
import { ARTICLE_CATEGORY } from '@/Helpers/contants/documentation';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ArticleCategoriesService } from './articleCategories.service';
import { CreateArticleCategoryDto } from './dto/create-articleCategory.dto';
import { UpdateArticleCategoryDto } from './dto/update-articleCategory.dto';

@Controller('article-categories')
export class ArticleCategoriesController {
  private readonly helpers = new Helpers();
  constructor(private readonly service: ArticleCategoriesService) {}

  @Get()
  @ApiOperation({
    summary: ARTICLE_CATEGORY.SUMMARY.GET,
    tags: [ARTICLE_CATEGORY.TAG],
  })
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

  @ApiOperation({
    summary: ARTICLE_CATEGORY.SUMMARY.FIND_BY_ID,
    tags: [ARTICLE_CATEGORY.TAG],
  })
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

  @Post()
  @ApiOperation({
    summary: ARTICLE_CATEGORY.SUMMARY.CREATE,
    tags: [ARTICLE_CATEGORY.TAG],
  })
  async create(@Body() payload: CreateArticleCategoryDto, @Res() res) {
    const data = await this.service.create(payload);

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @ApiOperation({
    summary: ARTICLE_CATEGORY.SUMMARY.UPDATE,
    tags: [ARTICLE_CATEGORY.TAG],
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateArticleCategoryDto,
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

  @ApiOperation({
    summary: ARTICLE_CATEGORY.SUMMARY.DELETE,
    tags: [ARTICLE_CATEGORY.TAG],
  })
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
