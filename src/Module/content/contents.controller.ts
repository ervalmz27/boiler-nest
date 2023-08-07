import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Body,
  Put,
} from '@nestjs/common';

import { ApiOperation } from '@nestjs/swagger';
import { CONTENT } from '@/Helpers/contants/documentation';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ContentsService } from './contents.service';
import { UpdateAdminDto } from './dto/update-content-dto';

@Controller('contents')
export class ContentsController {
  private readonly helpers = new Helpers();
  constructor(private readonly service: ContentsService) {}

  @Get()
  @ApiOperation({
    summary: CONTENT.SUMMARY.GET,
    tags: [CONTENT.TAG],
  })
  async findAll(@Res() res) {
    const user = await this.service.findAll();
    if (user.length < 1) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        user,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      user,
    );
  }

  @ApiOperation({ summary: CONTENT.SUMMARY.FIND_BYTYPE, tags: [CONTENT.TAG] })
  @Get(':type')
  async findOne(@Param('type') type: string, @Res() res) {
    const data = await this.service.findByType(type);
    if (data === null) {
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
      data,
    );
  }

  @ApiOperation({ summary: CONTENT.SUMMARY.UPDATE, tags: [CONTENT.TAG] })
  @Put(':type')
  async update(
    @Param('type') type: string,
    @Body() payload: UpdateAdminDto,
    @Res() res,
  ) {
    const updateAdmin = await this.service.upsert(type, payload);
    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateAdmin,
    );
  }
}
