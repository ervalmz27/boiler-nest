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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';

import { ApiOperation } from '@nestjs/swagger';
import { VOUCHER } from '@/Helpers/contants/documentation';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoucherSettingsService } from './voucherSettings.service';
import SpaceFile from '@/Helpers/files';

@Controller('vouchers')
export class VouchersController {
  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();

  constructor(
    private readonly service: VouchersService,
    private readonly settingService: VoucherSettingsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: VOUCHER.SUMMARY.GET,
    tags: [VOUCHER.TAG],
  })
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

  @ApiOperation({
    summary: VOUCHER.SUMMARY.FIND_BY_ID,
    tags: [VOUCHER.TAG],
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
    summary: VOUCHER.SUMMARY.CREATE,
    tags: [VOUCHER.TAG],
  })
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() payload: CreateVoucherDto,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'vouchers',
        file.mimetype,
      );

      if (fileObject) {
        payload['photo'] = fileObject.Location;
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
    summary: VOUCHER.SUMMARY.UPDATE,
    tags: [VOUCHER.TAG],
  })
  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateVoucherDto,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const voucher = await this.service.findOne(id);
    if (voucher === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        voucher,
      );
    }

    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'vouchers',
        file.mimetype,
      );

      if (fileObject) {
        payload['photo'] = fileObject.Location;
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
    summary: VOUCHER.SUMMARY.SETTING,
    tags: [VOUCHER.TAG],
  })
  @Post('/setting')
  async getSetting(@Res() res) {
    const voucherSetting = await this.settingService.findOne();
    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      voucherSetting,
    );
  }

  @Post('/setting/update')
  async updateSetting(@Body() payload: any, @Res() res) {
    const voucherSetting = await this.settingService.findOne();
    if (voucherSetting) {
      const updateData = await this.settingService.update(payload);
      return this.helpers.response(
        res,
        HttpStatus.OK,
        RESPONSES.DATA_UPDATED,
        updateData,
      );
    }

    const updateData = await this.settingService.create(payload);
    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_CREATED,
      updateData,
    );
  }

  @ApiOperation({
    summary: VOUCHER.SUMMARY.DELETE,
    tags: [VOUCHER.TAG],
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
