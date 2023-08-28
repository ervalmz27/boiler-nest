import {
  Controller,
  Get,
  Param,
  Res,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { LogsService } from './logs.service';

@Controller('contents')
export class LogsController {
  private readonly helpers = new Helpers();
  constructor(private readonly service: LogsService) {}

  @Get()
  async findAll(@Res() res) {
    const data = await this.service.findAll();
    return res.status(data.length < 1 ? 404 : 200).json({ data });
  }

  @Get(':id')
  async findByid(@Param('id') id: number, @Res() res) {
    const data = await this.service.findById(id);
    return res.status(data === null ? 404 : 200).json({ data });
  }

  @Post()
  async create(@Body() payload: any, @Res() res) {
    try {
      const data = await this.service.create(payload);
      return res.status(200).json({ data: data.id });
    } catch (error) {
      return res.status(500).json({ data: null, message: error.message });
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() payload: any, @Res() res) {
    try {
      const data = await this.service.update(id, payload);
      return res.status(200).json({ data: null });
    } catch (error) {
      return res.status(500).json({ data: null, message: error.message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Body() payload: any, @Res() res) {
    try {
      const data = await this.service.remove(id);
      return res.status(200).json({ data: null });
    } catch (error) {
      return res.status(500).json({ data: null, message: error.message });
    }
  }
}
