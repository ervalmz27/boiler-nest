import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Helpers from '@/Helpers/helpers';
import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  private readonly helpers = new Helpers();
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user list',
    description: '',
    tags: ['Users'],
  })
  async findAll(@Res() res) {
    const user = await this.usersService.findAll();
    return this.helpers.response(res, HttpStatus.OK, 'Data found', user);
  }

  @ApiOperation({
    summary: 'Find user by ID',
    description: '',
    tags: ['Users'],
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const user = await this.usersService.findOne(+id);
    return this.helpers.response(res, HttpStatus.OK, '', user);
  }

  @Post()
  @ApiOperation({
    summary: 'Add New User',
    description: '',
    tags: ['Users'],
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Update User Data',
    description: '',
    tags: ['Users'],
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete User',
    description: '',
    tags: ['Users'],
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
