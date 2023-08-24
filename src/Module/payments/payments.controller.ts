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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { PaymentsService } from './payments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import SpaceFile from '@/Helpers/files';
import { v1 as uuidv1 } from 'uuid';

@Controller('payments')
export class PaymentsController {
  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();
  constructor(private readonly service: PaymentsService) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const data = await this.service.findAll(req.query);
    if (data.length < 1) {
      return res.status(404).json({ data, message: 'Data not found' });
    }

    return res.status(200).json({ data, message: 'Data found' });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const admin = await this.service.findOne(+id);
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
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() payload: any,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'members',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
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

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() payload: any,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
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

    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'members',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
      }
    }

    if (
      typeof payload.is_deleted !== 'undefined' &&
      typeof file === 'undefined'
    ) {
      payload['image'] = null;
    }

    const updateData = await this.service.update(+id, payload);

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
}
