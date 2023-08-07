import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Service Check',
    description: '',
    tags: ['Default'],
  })
  serviceCheck(): string {
    return this.appService.serviceCheck();
  }
}
