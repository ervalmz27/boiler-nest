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
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { EventCollectionsService } from './eventCollections.service';
import { EventCollectionItemService } from './eventCollectionItems.service';
import { EventsService } from '../event/events.service';

@Controller('event-collections')
export class EventCollectionsController {
  private readonly helpers = new Helpers();
  constructor(
    private readonly service: EventCollectionsService,
    private readonly eventService: EventsService,
    private readonly eventItemService: EventCollectionItemService,
  ) {}

  @Get()
  async findAll(@Res() res) {
    const data = await this.service.findAll();
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

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const data = await this.service.findOne(+id);

    return data === null
      ? res.status(HttpStatus.NOT_FOUND).json({ data: null })
      : res.status(HttpStatus.OK).json({ data });
  }

  @Get(':id/events')
  async findEvents(@Param('id') id: number, @Res() res) {
    const data = await this.eventItemService.findByCollection(id);
    if (data.length < 1) return res.status(404).json({ data });

    let ret = [];
    for (const d of data) {
      const event = await this.eventService.findOne(d.event_id);
      ret.push(event);
    }
    return res.json({
      data: ret,
    });
  }

  @Post('deleteItem')
  async deleteEventItem(@Body() payload: any, @Res() res) {
    try {
      const { event_id, event_collection_id } = payload;
      const data = await this.eventItemService.removeCond({
        event_id,
        event_collection_id,
      });
      return res.status(HttpStatus.OK).json({ data, message: 'Item deleted' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Delete failed, ' + error.message });
    }
  }

  @Post('addItem')
  async addItem(@Body() payload: any, @Res() res) {
    const { event_collection_id, event_id } = payload;

    const bulkPayload = [];
    event_id.forEach((e) => {
      bulkPayload.push({
        event_collection_id: event_collection_id,
        event_id: e,
      });
    });
    const data = await this.eventItemService.bulkCreate(bulkPayload);
    return res.status(HttpStatus.OK).json({ data });
  }

  @Post()
  async create(@Body() payload: any, @Res() res) {
    const data = await this.service.create(payload);

    // TODO store product options
    if (typeof payload.events !== 'undefined') {
      try {
        const items = payload.events;
        const itemsPayload = [];
        items.forEach((e) => {
          itemsPayload.push({
            event_collection_id: data.id,
            event_id: e,
          });
        });

        await this.eventItemService.bulkCreate(itemsPayload);
      } catch (error) {
        // this.logger.error('Item payload issue', error.message);
      }
    }

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() payload: any, @Res() res) {
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

    return removeData > 0
      ? res.status(HttpStatus.OK).json({ data: { deletedId: id } })
      : res.status(HttpStatus.BAD_REQUEST).json({ data: null });
  }
}
