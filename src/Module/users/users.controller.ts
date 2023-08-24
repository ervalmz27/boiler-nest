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

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly helpers = new Helpers();
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const { q } = req.query;
    const user = await this.usersService.findAll(q || '');
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

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const admin = await this.usersService.findOne(+id);
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
  async create(@Body() payload, @Res() res) {
    const existingData = await this.usersService.findByEmail(payload.email);
    if (existingData) {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        'Email is already exists',
        null,
      );
    }

    payload.password = await bcrypt.hash(payload.password, 10);
    const data = await this.usersService.create(payload);
    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() payload: any, @Res() res) {
    const data = await this.usersService.findOne(id);
    if (data === null) {
      return res.status(404).json({ data, message: 'Data not found' });
    }

    if (typeof payload.password !== 'undefined') {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    payload.page_access = JSON.stringify(payload.page_access);
    const updateAdmin = await this.usersService.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateAdmin,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const data = await this.usersService.remove(+id);
    if (data > 0) {
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
