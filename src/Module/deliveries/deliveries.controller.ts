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

import { ApiOperation } from '@nestjs/swagger';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { DeliveriesService } from './deliveries.service';
import { DeliveryFreeSetupServices } from './deliveryFreeSetup.service';

import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { UpdateFreeSetupDto } from './dto/update-freesetup.dto';

@Controller('deliveries')
export class DeliveriesController {
  private readonly helpers = new Helpers();
  constructor(
    private readonly service: DeliveriesService,
    private readonly freeService: DeliveryFreeSetupServices,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const user = await this.service.findAll(req.query);
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

  @Put('/free-setup')
  async updateFreeSetup(@Body() payload: UpdateFreeSetupDto, @Res() res) {
    const data = await this.freeService.updateFreeSetup(1, payload);
    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      data,
    );
  }

  @Post('/free-setup')
  async findFreeSetup(@Res() res) {
    const data = await this.freeService.findFreeSetup();

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

  @Post()
  async create(@Body() payload: CreateDeliveryDto, @Res() res) {
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
    @Body() payload: UpdateDeliveryDto,
    @Res() res,
  ) {
    const DELIVERY = await this.service.findOne(id);
    if (DELIVERY === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        DELIVERY,
      );
    }

    const updateAdmin = await this.service.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateAdmin,
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
