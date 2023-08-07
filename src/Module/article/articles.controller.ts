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
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';

import { ApiOperation } from '@nestjs/swagger';
import { ARTICLE_CATEGORY } from '@/Helpers/contants/documentation';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import SpaceFile from '@/Helpers/files';
import { v1 as uuidv1 } from 'uuid';

@Controller('articles')
export class ArticlesController {
  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();

  constructor(private readonly service: ArticlesService) {}

  @Get()
  async findAll(@Query() payload, @Res() res, @Req() req) {
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
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() payload: CreateArticleDto,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'articles',
        file.mimetype,
      );

      if (fileObject) {
        payload['thumbnail'] = fileObject.Location;
      }
    }

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
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateArticleDto,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const articleData = await this.service.findOne(id);
    if (articleData === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        articleData,
      );
    }

    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'articles',
        file.mimetype,
      );

      if (fileObject) {
        // await this.spacefile.deleteObject(articleData.thumbnail);
        payload['thumbnail'] = fileObject.Location;
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
