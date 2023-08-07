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
import { FeedsService } from './feeds.service';
import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { FEED } from '@/Helpers/contants/documentation';
import { ApiOperation } from '@nestjs/swagger';
import { CreateFeedDTO } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Controller('feeds')
export class UsersController {
  private readonly helpers = new Helpers();
  constructor(private readonly feedService: FeedsService) {}

  @Get()
  @ApiOperation({
    summary: FEED.SUMMARY.GET,
    tags: [FEED.TAG],
  })
  async findAll(@Res() res) {
    const feeds = await this.feedService.findAll();
    if (feeds.length < 1) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        feeds,
      );
    }

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_FOUND,
      feeds,
    );
  }

  @ApiOperation({ summary: FEED.SUMMARY.FIND_BY_ID, tags: [FEED.TAG] })
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    const user = await this.feedService.findOne(+id);
    if (user === null) {
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

  @Post()
  @ApiOperation({ summary: FEED.SUMMARY.CREATE, tags: [FEED.TAG] })
  async create(@Body() createFeedDto: CreateFeedDTO, @Res() res) {
    const data = await this.feedService.create(createFeedDto);
    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      RESPONSES.DATA_CREATED,
      data,
    );
  }

  @ApiOperation({ summary: FEED.SUMMARY.UPDATE, tags: [FEED.TAG] })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: UpdateFeedDto,
    @Res() res,
  ) {
    const feed = await this.feedService.findOne(id);
    if (feed === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        feed,
      );
    }
    const modifyFeed = await this.feedService.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      modifyFeed,
    );
  }

  @ApiOperation({ summary: FEED.SUMMARY.DELETE, tags: [FEED.TAG] })
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res) {
    const removeData = await this.feedService.remove(+id);
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
