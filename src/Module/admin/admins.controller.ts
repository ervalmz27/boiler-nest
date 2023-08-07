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
import * as bcrypt from 'bcrypt';

import { ApiOperation } from '@nestjs/swagger';
import { PAYMENT } from '@/Helpers/contants/documentation';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminsController {
  private readonly helpers = new Helpers();
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @ApiOperation({
    summary: PAYMENT.SUMMARY.GET,
    tags: [PAYMENT.TAG],
  })
  async findAll(@Res() res, @Req() req) {
    const { q } = req.query;
    const user = await this.adminsService.findAll(q || '');
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

  @ApiOperation({ summary: PAYMENT.SUMMARY.FIND_BY_ID, tags: [PAYMENT.TAG] })
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const admin = await this.adminsService.findOne(+id);
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
  @ApiOperation({ summary: PAYMENT.SUMMARY.CREATE, tags: [PAYMENT.TAG] })
  async create(@Body() payload: CreateAdminDto, @Res() res) {
    const existingData = await this.adminsService.findByEmail(payload.email);
    if (existingData) {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        'Email is already exists',
        null,
      );
    }

    payload.password = await bcrypt.hash(payload.password, 10);
    payload.page_access = JSON.stringify(payload.page_access);
    const data = await this.adminsService.create(payload);
    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @ApiOperation({ summary: PAYMENT.SUMMARY.UPDATE, tags: [PAYMENT.TAG] })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateAdminDto,
    @Res() res,
  ) {
    const PAYMENT = await this.adminsService.findOne(id);
    if (PAYMENT === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        PAYMENT,
      );
    }

    if (typeof payload.password !== 'undefined') {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    payload.page_access = JSON.stringify(payload.page_access);
    const updateAdmin = await this.adminsService.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateAdmin,
    );
  }

  @ApiOperation({ summary: PAYMENT.SUMMARY.DELETE, tags: [PAYMENT.TAG] })
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const removeData = await this.adminsService.remove(+id);
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
