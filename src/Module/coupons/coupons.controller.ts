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
  Request,
  UseGuards,
  Logger,
} from '@nestjs/common';
import * as moment from 'moment-timezone';
import { Cron, CronExpression } from '@nestjs/schedule';
import { allowRunningCron } from '@/Config/generic.config';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponTiersService } from './couponTiers.service';
import { MembersService } from '../member/members.service';
import { MemberCouponsService } from '../member/memberCoupon.service';
import { XAuthGuards } from '../auth/xauth.guard';

@Controller('coupons')
export class CouponsController {
  private readonly helpers = new Helpers();
  private readonly logger = new Logger(CouponsController.name);

  constructor(
    private readonly service: CouponsService,
    private readonly memberService: MembersService,
    private readonly memberCouponService: MemberCouponsService,
    private readonly couponService: CouponsService,
    private readonly couponTierService: CouponTiersService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const { q } = req.query;
    const data = await this.service.findAll(q);
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

  @UseGuards(XAuthGuards)
  @Post('getMemberCoupons')
  async getMemberCoupons(@Res() res, @Request() req) {
    const member_id = req.user.id;
    const coupons = await this.memberCouponService.getMemberAvailableCoupon({
      member_id,
    });
    return res.status(HttpStatus.OK).json({
      success: true,
      data: coupons,
      message: 'Data found',
    });
  }

  @UseGuards(XAuthGuards)
  @Post('getCouponByMember')
  async getCouponByMember(@Res() res, @Body() payload) {
    const memberCoupons = await this.memberCouponService.getAllMemberCoupon(
      payload.member_id,
    );
    if (memberCoupons.length < 1) {
      return res.status(HttpStatus.NOT_FOUND).json({
        data: [],
        message: 'Data not found',
      });
    }

    return res.status(HttpStatus.OK).json({
      data: memberCoupons,
      message: 'Data found',
    });
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
  async create(@Body() payload: CreateCouponDto, @Res() res) {
    if (typeof payload.category_birthday_month !== 'undefined') {
      payload.category_birthday_month = JSON.stringify(
        payload.category_birthday_month,
      );
    }
    const data = await this.service.create(payload);
    const tiers = payload.tiers;
    // Get Member by Tiers
    const members = await this.memberService.findByMemberTier(tiers);
    const memberIds = members.map((e) => e.id);

    await this.memberCouponService.bulkCreate(memberIds, data);
    await this.couponTierService.bulkCreate({
      id: data.id,
      tiers: tiers,
    });
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
    @Body() payload: UpdateCouponDto,
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
    await this.couponTierService.truncate({ coupon_id: id });

    const tiers = payload.tiers.map((e) => e.id);
    await this.couponTierService.bulkCreate({
      id: id,
      tiers: tiers,
    });
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

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: 'Asia/Hong_Kong',
  })
  async expiryChecking() {
    if (allowRunningCron) {
      this.logger.log(`CRON | Start Running Coupon Expiry Checking ...`);
      const expiredCoupon = await this.memberCouponService.checkExpiredCoupon();

      let ids = expiredCoupon.map((e) => e.id);
      const update = await this.memberCouponService.markAsExpired(ids);
      this.logger.log(
        'CRON | End Running Cron  - Mark as Expired for id: ' +
          JSON.stringify(ids),
      );
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {
    timeZone: 'Asia/Hong_Kong',
  })
  async birthdayChecking(@Res() res) {
    if (allowRunningCron) {
      this.logger.log(`CRON | Coupon - Attach Birthday Coupon to member`);

      const birthdayMember = await this.memberService.getBirthdayMember();
      for (const member of birthdayMember) {
        const birthdayCoupon = await this.service.getBirthDayCoupon(
          member.tier_id,
        );

        for (const coupon of birthdayCoupon) {
          const expiredTime = moment()
            .tz('Asia/Hong_Kong')
            .add(coupon.expiry, 'hours')
            .format('YYYY-MM-DD HH:mm:ss');
          await this.memberCouponService.addCoupon({
            member_id: member.id,
            coupon_id: coupon.id,
            start_at: coupon.campaign_start,
            expired_at: expiredTime,
            status: 'AVAILABLE',
          });
        }
      }
    }
  }
}
