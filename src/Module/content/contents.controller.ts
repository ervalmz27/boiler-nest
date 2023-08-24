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
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { ContentsService } from './contents.service';
import { UpdateAdminDto } from './dto/update-content-dto';

@Controller('contents')
export class ContentsController {
  private readonly helpers = new Helpers();
  constructor(private readonly service: ContentsService) {}

  @Get()
  async findAll(@Res() res) {
    const data = await this.service.findAll();
    if (data.length < 1) {
      return res.status(404).json({ data, message: 'Data not found' });
    }

    return res.status(200).json({ data, message: 'Data found' });
  }

  @Get(':type')
  async findOne(@Param('type') type: string, @Res() res) {
    const data = await this.service.findByType(type);
    if (data === null) {
      return res
        .status(404)
        .response({ data: null, message: 'Data not found' });
    }

    return res.status(200).json({ data, message: 'Data found' });
  }

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
