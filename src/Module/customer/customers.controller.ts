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
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';

import { CustomersService } from './customers.service';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import SpaceFile from '@/Helpers/files';
import { TransactionsService } from '../transaction/services/transactions.service';

@Controller('customers')
export class CustomersController {
  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();
  private readonly logger = new Logger(CustomersController.name);

  constructor(
    private readonly service: CustomersService,
    private readonly transactionService: TransactionsService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;
    const user = await this.service.findAll(payload);
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
    const data = await this.service.findOne(+id);
    if (data === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        data,
      );
    }

    data.dataValues['total_spending'] =
      await this.transactionService.getTotalSpendingByCustomer(id);

    return res.status(200).json({ data });
  }

  @Post()
  async create(@Body() payload, @Res() res) {
    try {
      if (typeof payload.password !== 'undefined') {
        payload['password'] = await bcrypt.hash(payload.password, 10);
      }
      const data = await this.service.create(payload);
      await this.service.addCustomerBank(data.id, payload.banks);
      return res.status(200).json({
        data: {
          id: data.id,
        },
      });
    } catch (error) {
      return res.status(500).json({ data: null, message: error.message });
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() payload, @Res() res) {
    const data = await this.service.findOne(id);
    if (data === null) {
      return res.status(404).json({ data, message: 'Data not found' });
    }

    await this.service.update(+id, payload);
    await this.service.updateCustomerBank(id, payload.banks);
    await this.service.deletedBanks(payload.deletedBanks);

    return res.status(200).json({ data: null });
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const removeData = await this.service.remove(+id);
    return this.helpers.response(res, HttpStatus.OK, RESPONSES.DATA_DELETED, {
      deletedId: id,
    });
  }
}
