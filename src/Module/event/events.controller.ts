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
import { v1 as uuidv1 } from 'uuid';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { EventsService } from './events.service';
import { FileInterceptor } from '@nestjs/platform-express';
import SpaceFile from '@/Helpers/files';
import { EventTicketsService } from './eventTickets.service';
import { EventTimeslotsService } from './eventTimeslots.service';
import { EventFormService } from './eventForm.service';
import { TransactionEventService } from '../transaction/transactionEvent.service';

@Controller('events')
export class EventsController {
  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();
  constructor(
    private readonly eventService: EventsService,
    private readonly eventTicketService: EventTicketsService,
    private readonly eventTimeslotService: EventTimeslotsService,
    private readonly trxEventService: TransactionEventService,
    private readonly formService: EventFormService,
  ) {}

  @Get()
  async findAll(@Res() res, @Req() req) {
    const payload = req.query;
    const data = await this.eventService.findAll(payload);

    const ret = [];
    for (const d of data) {
      const tot = await this.trxEventService.getTotalParticipantByEvent(d.id);
      d.dataValues['total_participants'] = tot;
      ret.push(d);
    }

    return res
      .status(ret.length < 1 ? HttpStatus.NOT_FOUND : HttpStatus.OK)
      .json({
        data: ret,
        message: ret.length < 1 ? 'Data not found' : 'Data found',
      });
  }

  @Post('findPast')
  async findPast(@Res() res, @Req() req) {
    const data = await this.eventService.findPast(req.query);
    if (data.length < 1)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ data, message: 'Data not found' });

    return res.status(HttpStatus.OK).json({ data, message: 'Data found' });
  }

  @Post('findUpcoming')
  async findUpcoming(@Res() res, @Req() req) {
    const data = await this.eventService.findUpcoming(req.query);
    if (data.length < 1)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ data, message: 'Data not found' });

    return res.status(HttpStatus.OK).json({ data, message: 'Data found' });
  }

  // @Get('/timeslot/past')
  // async findPast(@Res() res) {
  //   const past = await this.eventTimeslotService.findPastEvent();
  //   const eventIds = past.map((e) => e.event_id);
  //   const event = await this.eventService.findByArrayId(eventIds);
  //   return this.helpers.response(
  //     res,
  //     HttpStatus.OK,
  //     RESPONSES.DATA_FOUND,
  //     event,
  //   );
  // }

  // @Get('/timeslot/upcoming')
  // async findUpcoming(@Res() res) {
  //   const upcoming = await this.eventTimeslotService.findUpcomingEvent();
  //   const eventIds = upcoming.map((e) => e.event_id);
  //   const event = await this.eventService.findByArrayId(eventIds);
  //   return this.helpers.response(
  //     res,
  //     HttpStatus.OK,
  //     RESPONSES.DATA_FOUND,
  //     event,
  //   );
  // }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const admin = await this.eventService.findOne(+id);
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
        'events',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
      }
    }

    const data = await this.eventService.create(payload);
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
    const event = await this.eventService.findOne(id);
    if (event === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        event,
      );
    }

    if (typeof file !== 'undefined') {
      const { buffer, originalname } = file;
      const fileName = uuidv1() + '.' + originalname.split('.').pop();

      const fileObject: any = await this.spacefile.uploadObject(
        buffer,
        fileName,
        'events',
        file.mimetype,
      );

      if (fileObject) {
        payload['image'] = fileObject.Location;
      }
    }

    if (typeof file === 'undefined' && payload.is_delete_image === '1') {
      payload['image'] = null;
    }

    const updateEvent = await this.eventService.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateEvent,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const removeData = await this.eventService.remove(+id);
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

  @Get(':id/timeslot')
  async findTimeslot(@Res() res, @Param('id') id: number) {
    const eventimeslot = await this.eventTimeslotService.findByEvent(id);
    if (eventimeslot.length < 1) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        eventimeslot,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      eventimeslot,
    );
  }

  @Get(':id/timeslot/:timeslot_id')
  async findTimeslotById(
    @Res() res,
    @Param('id') id: number,
    @Param('timeslot_id') timeslot_id: number,
  ) {
    const payload = {
      event_id: id,
      timeslot_id: timeslot_id,
    };
    const eventTimeslot = await this.eventTimeslotService.findTimeslotById(
      payload,
    );
    if (eventTimeslot === null) {
      return this.helpers.response(
        res,
        HttpStatus.OK,
        RESPONSES.DATA_NOTFOUND,
        eventTimeslot,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      eventTimeslot,
    );
  }

  @Post(':id/timeslot')
  async addTimeslot(@Param('id') id: number, @Res() res, @Body() payload: any) {
    payload.event_id = id;
    const addtimeslot = await this.eventTimeslotService.addTimeslot(payload);
    if (addtimeslot) {
      return this.helpers.response(
        res,
        HttpStatus.OK,
        RESPONSES.DATA_CREATED,
        null,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      'error add timeslot',
      null,
    );
  }

  @Put(':id/timeslot')
  async updateTimeslot(
    @Param('id') id: number,
    @Res() res,
    @Body() payload: any,
  ) {
    payload.event_id = id;
    const timeslot = await this.eventTimeslotService.updateTimeslot(payload);
    if (timeslot) {
      return this.helpers.response(res, HttpStatus.OK, 'Data Updated', null);
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      'Error update',
      null,
    );
  }

  @Delete(':id/timeslot/:timeslot_id')
  async deleteTimeslot(
    @Param('id') id: number,
    @Param('timeslot_id') timeslot_id: number,
    @Res() res,
  ) {
    const payload = {
      event_id: id,
      timeslot_id: timeslot_id,
    };
    const timeslot = await this.eventTimeslotService.deleteTimeslot(payload);
    if (timeslot) {
      return this.helpers.response(
        res,
        HttpStatus.OK,
        'Timeslot deleted',
        null,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      'Error delete timeslot',
      null,
    );
  }

  @Get(':id/ticket')
  async findTicket(@Res() res, @Param('id') id: number) {
    const eventimeslot = await this.eventTicketService.findByEvent(id);
    if (eventimeslot.length < 1) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        eventimeslot,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      eventimeslot,
    );
  }

  @Get(':id/ticket/:ticket_id')
  async findTicketById(
    @Res() res,
    @Param('id') id: number,
    @Param('ticket_id') ticket_id: number,
  ) {
    const payload = {
      event_id: id,
      ticket_id: ticket_id,
    };
    const eventicket = await this.eventTicketService.findTicketById(payload);
    if (eventicket === null) {
      return this.helpers.response(
        res,
        HttpStatus.OK,
        RESPONSES.DATA_NOTFOUND,
        eventicket,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      eventicket,
    );
  }

  @Post(':id/ticket')
  async addTicket(@Param('id') id: number, @Res() res, @Body() payload: any) {
    payload.event_id = id;
    const addtimeslot = await this.eventTicketService.addTicket(payload);
    if (addtimeslot) {
      return this.helpers.response(
        res,
        HttpStatus.OK,
        RESPONSES.DATA_CREATED,
        null,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      'error add ticket',
      null,
    );
  }

  @Put(':id/ticket')
  async updateTicket(
    @Param('id') id: number,
    @Res() res,
    @Body() payload: any,
  ) {
    payload.event_id = id;
    const timeslot = await this.eventTicketService.updateTicket(payload);
    if (timeslot) {
      return this.helpers.response(res, HttpStatus.OK, 'Data Updated', null);
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      'Error update',
      null,
    );
  }

  @Delete(':id/ticket/:ticket_id')
  async deleteTicket(
    @Param('id') id: number,
    @Param('ticket_id') ticket_id: number,
    @Res() res,
  ) {
    const timeslot = await this.eventTicketService.deleteTicket({
      event_id: id,
      ticket_id: ticket_id,
    });
    if (timeslot) {
      return this.helpers.response(res, HttpStatus.OK, 'Ticket deleted', null);
    }

    return this.helpers.response(
      res,
      HttpStatus.BAD_REQUEST,
      'Error delete ticket',
      null,
    );
  }

  @Get(':id/form')
  async getForm(@Param('id') id: number, @Res() res) {
    const data = await this.formService.findByEvent(id);
    return data.length < 1
      ? res
          .status(HttpStatus.NOT_FOUND)
          .json({ data, message: 'Data not found' })
      : res.status(HttpStatus.OK).json({ data });
  }

  @Get(':id/form/:form_id')
  async getFormByFormId(
    @Param('id') id: number,
    @Param('form_id') form_id: number,
    @Res() res,
  ) {
    const data = await this.formService.findById(form_id);

    return data === null
      ? res
          .status(HttpStatus.NOT_FOUND)
          .json({ data, message: 'Data not found' })
      : res.status(HttpStatus.OK).json({ data });
  }

  @Post(':id/form')
  async addForm(@Param('id') id: number, @Body() payload: any, @Res() res) {
    try {
      payload['event_id'] = id;
      payload['options'] = JSON.stringify(payload.options);
      const data = await this.formService.create(payload);
      return res
        .status(HttpStatus.OK)
        .json({ data: null, message: 'Form Created' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, message: error.message });
    }
  }

  @Put(':id/form/:form_id')
  async editForm(
    @Param('id') id: number,
    @Param('form_id') form_id: number,
    @Body() payload: any,
    @Res() res,
  ) {
    try {
      payload['options'] = JSON.stringify(payload.options);
      const data = await this.formService.update(form_id, payload);
      return res
        .status(HttpStatus.OK)
        .json({ data: null, message: 'Form Updated' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, message: error.message });
    }
  }

  @Delete(':id/form/:form_id')
  async deleteForm(
    @Param('id') id: number,
    @Param('form_id') form_id: number,
    @Res() res,
  ) {
    try {
      const data = await this.formService.remove({
        id,
        form_id,
      });
      return res
        .status(HttpStatus.OK)
        .json({ data: null, message: 'Form Deleted' });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, message: error.message });
    }
  }
}
