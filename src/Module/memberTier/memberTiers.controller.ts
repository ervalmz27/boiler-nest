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

import { MemberTiersService } from './memberTiers.service';
import { MembersService } from '../member/members.service';

import { CreateMemberTierDto } from './dto/create-memberTier.dto';
import { UpdateMemberTierDto } from './dto/update-memberTier.dto';

@Controller('member-tiers')
export class MemberTiersController {
  private readonly helpers = new Helpers();
  constructor(
    private readonly memberTierService: MemberTiersService,
    private readonly memberService: MembersService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;

    const tiers = await this.memberTierService.findAll(payload);
    const ret = [];

    for (const tier of tiers) {
      tier['total_member'] = await this.memberService.countByTier(tier.id);
      ret.push(tier);
    }

    if (tiers.length < 1) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        tiers,
      );
    }

    return this.helpers.response(res, HttpStatus.OK, 'Data Found', tiers);
  }

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
  async create(@Body() payload: CreateMemberTierDto, @Res() res) {
    if (typeof payload.excluded_hashtags !== 'undefined') {
      payload['excluded_hashtags'] = JSON.stringify(payload.excluded_hashtags);
    }
    const data = await this.memberTierService.create(payload);

    if (typeof payload.is_default !== 'undefined' && payload.is_default === 1) {
      await this.memberTierService.setAsDefault(data.id);
    }

    return res.status(HttpStatus.CREATED).json({
      success: true,
      data: data,
      message: 'Member tier created',
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateMemberTierDto,
    @Res() res,
  ) {
    const tier = await this.memberTierService.findOne(id);
    if (tier === null) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Member tier not found',
      });
    }

    if (typeof payload.excluded_hashtags !== 'undefined') {
      payload['excluded_hashtags'] = JSON.stringify(payload.excluded_hashtags);
    }
    const updateData = await this.memberTierService.update(+id, payload);

    if (typeof payload.is_default !== 'undefined' && payload.is_default === 1) {
      await this.memberTierService.setAsDefault(id);
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      data: null,
      message: 'Member tier updated',
    });
  }

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
