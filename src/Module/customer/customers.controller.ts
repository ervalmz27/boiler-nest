import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Res,
  Req,
  Request,
  Body,
  Delete,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';
import { FileInterceptor } from '@nestjs/platform-express';

import { CustomersService } from './customers.service';
import { NotificationsService } from '../notifications/notifications.service';

import Helpers from '@/Helpers/helpers';
import { RESPONSES } from '@/Helpers/contants';
import SpaceFile from '@/Helpers/files';
import { TEMPLATE_ID } from '@/Helpers/contants/sengridtemplate';

import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { XAuthGuards } from '../auth/xauth.guard';

@Controller('members')
export class CustomersController {
  private readonly helpers = new Helpers();
  private spacefile = new SpaceFile();
  private readonly logger = new Logger(CustomersController.name);

  constructor(
    private readonly service: CustomersService,
    private readonly notificationService: NotificationsService,
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
    const user = await this.service.findOne(+id);
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
  @UseInterceptors(FileInterceptor('photo'))
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
        payload['photo'] = fileObject.Location;
      }
    }

    const existEmail = await this.service.findByEmail(payload.email);
    if (existEmail !== null) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: 'Email is already registered before',
      });
    }

    const existPhone = await this.service.findByPhone(payload.phone);
    if (existPhone !== null) {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        'Phoneis already registered before',
        null,
      );
    }

    if (typeof payload.password !== 'undefined') {
      payload['password'] = await bcrypt.hash(payload.password, 10);
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
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id') id: number,
    @Body() payload: any,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.service.findOne(id);
    if (data === null) {
      return this.helpers.response(
        res,
        HttpStatus.NOT_FOUND,
        RESPONSES.DATA_NOTFOUND,
        data,
      );
    }

    const memberByEmail = await this.service.findByEmail(payload.email);
    if (memberByEmail !== null && memberByEmail.email !== data.email) {
      return this.helpers.response(
        res,
        HttpStatus.BAD_REQUEST,
        `Email ${payload.email} is already registered`,
        null,
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
        payload['photo'] = fileObject.Location;
      }
    }

    const updateAdmin = await this.service.update(+id, payload);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      RESPONSES.DATA_UPDATED,
      updateAdmin,
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

  @Post('/registration')
  async register(@Body() payload: RegisterDto, @Res() res) {
    const existEmailUser = await this.service.findByEmail(payload.email);
    if (existEmailUser !== null) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        data: null,
        message: 'Email already registered',
      });
    }

    const existPhoneUser = await this.service.findByPhone(payload.phone);
    if (existPhoneUser !== null) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        data: null,
        message: 'Phone already registered',
      });
    }

    const generatedPassword = await bcrypt.hash(payload.password, 10);

    const newPayload = {
      name: payload.name,
      email: payload.email,
      password: generatedPassword,
      phone: payload.phone.replace('+', ''),
      birth_date: this.helpers.castDate(payload.birth_date),
      token: uuidv1(),
    };
    const data = await this.service.create(newPayload);

    await this.notificationService.sendEmail({
      service_sender: 'MEMBER REGISTRATION',
      destination: payload.email,
      templateId: TEMPLATE_ID.REGISTRATION,
      templatePayload: {
        customer_firstname: payload.name,
        customer_lastname: '',
      },
    });

    return res.status(HttpStatus.OK).send({
      success: true,
      data: data,
      message: 'Success Register New User',
    });
  }

  @Post('/reset_password')
  async resetPassword(@Body() payload: ResetPasswordDto, @Res() res) {
    const user = await this.service.findByEmail(payload.email);
    if (user === null) {
      return this.helpers.responseJson(
        res,
        false,
        null,
        'Email not found',
        404,
      );
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const encryptedPassword = await bcrypt.hash(randomPassword, 10);

    await this.service.update(user.id, {
      password: encryptedPassword,
    });

    const sendmail = await this.notificationService.sendEmail({
      service_sender: 'MEMBER RESET PASSWORD',
      destination: payload.email,
      templateId: TEMPLATE_ID.RESET_PASSWORD,
      templatePayload: {
        reset_password: randomPassword,
      },
    });

    return this.helpers.responseJson(res, true, null, 'Success reset password');
  }

  @Post('/login')
  async login(@Body() payload: any, @Res() res) {
    let user = null;
    if (payload.grant_type === 'email') {
      user = await this.service.findByEmail2(payload.email);
      if (user === null) {
        return this.helpers.response(
          res,
          HttpStatus.NOT_FOUND,
          'Email not found',
          null,
        );
      }
    } else {
      user = await this.service.findByPhone2(payload.phone);
      if (user === null) {
        return this.helpers.responseJson(
          res,
          false,
          null,
          'Phone number is not registered',
          404,
        );
      }
    }

    const isMatch = await bcrypt.compare(payload.password, user.password);

    if (!isMatch) {
      return this.helpers.responseJson(
        res,
        false,
        null,
        'Invalid email and password',
        401,
      );
    }

    return this.helpers.responseJson(res, true, user, 'Login Success');
  }

  @UseGuards(XAuthGuards)
  @Post('/change_password')
  async changePassword(
    @Request() req,
    @Body() payload: ChangePasswordDto,
    @Res() res,
  ) {
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    const user = req.user;
    console.log(user);
    await this.service.update(user.id, {
      password: encryptedPassword,
    });

    return this.helpers.response(
      res,
      HttpStatus.OK,
      'Success Change Password',
      null,
    );
  }

  @UseGuards(XAuthGuards)
  @Post('/profile')
  async getProfile(@Request() req, @Res() res) {
    const { userToken } = req;

    const userdata = await this.service.findBytoken(userToken);
    return res.send({
      success: true,
      data: userdata,
      message: 'Data found',
    });
  }

  @UseGuards(XAuthGuards)
  @Post('/deleteUserAcc')
  async deleteUserAcc(@Request() req, @Res() res) {
    const { userToken } = req;
    await this.service.removeByToken(userToken);
    return this.helpers.responseJson(res, true, null, 'Sucess delete user');
  }

  @UseGuards(XAuthGuards)
  @Post('/updateProfile')
  async updateProfile(@Request() req, @Body() payload: any, @Res() res) {
    const { userToken } = req;

    if (typeof payload.password !== 'undefined') {
      payload['password'] = await bcrypt.hash(payload.password, 10);
    }
    if (typeof payload.birth_date !== 'undefined') {
      payload['birth_date'] = this.helpers.castDate(payload.birth_date);
    }
    await this.service.updateProfileByToken(userToken, payload);
    return this.helpers.responseJson(
      res,
      true,
      null,
      'Success update user profile',
    );
  }
}
