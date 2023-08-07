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
import { MEMBER_TIER } from '@/Helpers/contants/documentation';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { EventCategoriesService } from './eventCategories.service';
import { CreateEventCategoryDto } from './dto/create-eventCategory.dto';
import { UpdateEventCategoryDto } from './dto/update-eventCategory.dto';

@Controller('event-categories')
export class MemberTiersController {
  private readonly helpers = new Helpers();
  constructor(private readonly memberTierService: EventCategoriesService) {}

  @Get()
  @ApiOperation({
    summary: MEMBER_TIER.SUMMARY.GET,
    tags: [MEMBER_TIER.TAG],
  })
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;
    const data = await this.memberTierService.findAll(payload);
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
    summary: MEMBER_TIER.SUMMARY.FIND_BY_ID,
    tags: [MEMBER_TIER.TAG],
  })
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const admin = await this.memberTierService.findOne(+id);
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
    summary: MEMBER_TIER.SUMMARY.CREATE,
    tags: [MEMBER_TIER.TAG],
  })
  async create(@Body() payload: CreateEventCategoryDto, @Res() res) {
    const data = await this.memberTierService.create(payload);

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @ApiOperation({
    summary: MEMBER_TIER.SUMMARY.UPDATE,
    tags: [MEMBER_TIER.TAG],
  })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateEventCategoryDto,
    @Res() res,
  ) {
    const PAYMENT = await this.memberTierService.findOne(id);
    if (PAYMENT === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        PAYMENT,
      );
    }

    const updateData = await this.memberTierService.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateData,
    );
  }

  @ApiOperation({
    summary: MEMBER_TIER.SUMMARY.DELETE,
    tags: [MEMBER_TIER.TAG],
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const removeData = await this.memberTierService.remove(+id);
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
