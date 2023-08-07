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
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import { CartService } from './cart.service';
import { ProductOptionsService } from '../product/productOptions.service';

import { XAuthGuards } from '../auth/xauth.guard';

@Controller('carts')
export class CartController {
  private readonly helpers = new Helpers();
  private readonly logger = new Logger('Cart');

  constructor(
    private readonly service: CartService,
    private readonly productOptionService: ProductOptionsService,
  ) {}

  @UseGuards(XAuthGuards)
  @Get()
  async findAll(@Request() req, @Res() res) {
    let {
      user: { id },
    } = req;

    const cartProduct = await this.service.getProductItem(id);
    const cartEvent = await this.service.getEventItem(id);
    const cartCoupons = [];

    const items = {
      products: cartProduct,
      events: cartEvent,
      coupons: cartCoupons,
    };
    return this.helpers.responseJson(res, true, items, 'Found Cart Data', 200);
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

  @UseGuards(XAuthGuards)
  @Post('/addProduct')
  async addProduct(@Request() req, @Body() payload: any, @Res() res) {
    const { product_option_id, qty } = payload;
    const {
      user: { id },
    } = req;

    const productOptionData = await this.productOptionService.findOne({
      id: product_option_id,
    });
    if (productOptionData === null) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: 'Product option not found',
      });
    }

    if (productOptionData.quantity !== -1) {
      if (qty > productOptionData.quantity) {
        return this.helpers.responseJson(
          res,
          false,
          null,
          'Product Stock is not available',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newPayload = {
      ...payload,
      member_id: id,
    };

    try {
      const data = await this.service.addProduct(newPayload);
      return this.helpers.responseJson(
        res,
        true,
        data,
        'Success add product to Cart',
        201,
      );
    } catch (error) {
      this.logger.error(
        'Error add item to cart ' + error.message,
        'Cart.addProduct',
      );
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Failed add product to cart',
      });
    }
  }

  @UseGuards(XAuthGuards)
  @Post('/updateProduct')
  async updateProduct(@Request() req, @Body() payload: any, @Res() res) {
    const { id, product_option_id, qty } = payload;
    const { user } = req;

    const cartItem = await this.service.findById(id);
    if (cartItem === null) {
      return this.helpers.responseJson(
        res,
        false,
        null,
        'Cart item data not found',
        404,
      );
    }

    const productOptionData = await this.productOptionService.findOne({
      id: product_option_id,
    });
    if (productOptionData === null) {
      return this.helpers.responseJson(
        res,
        false,
        null,
        'Product option not found',
        404,
      );
    }

    if (productOptionData.quantity !== -1) {
      if (qty > productOptionData.quantity) {
        return this.helpers.responseJson(
          res,
          false,
          null,
          'Product Stock is not available',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newPayload = {
      ...payload,
      member_id: id,
    };

    try {
      const data = await this.service.updateProduct(newPayload);
      return this.helpers.responseJson(
        res,
        true,
        data,
        'Success add product to Cart',
        201,
      );
    } catch (error) {
      return this.helpers.responseJson(
        res,
        false,
        null,
        'Failed add product to cart',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(XAuthGuards)
  @Post('/deleteItem')
  async deleteItem(@Request() req, @Body() payload: any, @Res() res) {
    const { id } = payload;
    const { user } = req;

    try {
      const cartItem = await this.service.findById(id);
      if (cartItem === null) {
        return this.helpers.responseJson(
          res,
          false,
          null,
          'Cart item not found',
          404,
        );
      }
      await this.service.deleteItem(id);
      return this.helpers.responseJson(
        res,
        true,
        null,
        'Cart Item deleted',
        200,
      );
    } catch (error) {
      return this.helpers.responseJson(
        res,
        false,
        null,
        'Failed to delete item',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(XAuthGuards)
  @Post('/addEvent')
  async addEvent(@Request() req, @Body() payload: any, @Res() res) {
    const { event_id, event_timeslot_id, event_ticket_id, qty } = payload;
    const {
      user: { id },
    } = req;

    const existingdata = await this.service.findEventonCart({
      event_id,
      event_timeslot_id,
      event_ticket_id,
    });
    console.log(existingdata);
    if (existingdata !== null)
      return res
        .status(400)
        .json({ success: false, data: null, message: 'Its already exist' });

    try {
      const data = await this.service.addEvent({
        member_id: id,
        event_id,
        event_timeslot_id,
        event_ticket_id,
        qty,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        data,
        message: 'Success add event to cart',
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: 'Failed add event to cart',
      });
    }
  }

  @UseGuards(XAuthGuards)
  @Post('/updateEvent')
  async updateEvent(@Request() req, @Body() payload: any, @Res() res) {
    const { event_id, event_timeslot_id, event_ticket_id, qty } = payload;
    const {
      user: { id },
    } = req;

    const existingdata = await this.service.findEventonCart({
      event_id,
      event_timeslot_id,
      event_ticket_id,
    });

    if (existingdata === null)
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Event ticket not found',
      });

    try {
      const data = await this.service.updateEvent({
        member_id: id,
        event_id,
        event_timeslot_id,
        event_ticket_id,
        qty,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        data,
        message: 'Success updatem cart',
      });
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: 'Failed update event to cart',
      });
    }
  }
}
