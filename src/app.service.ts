import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serviceCheck(): any {
    return {
      services: 'Yingshun API',
      v: 1,
    };
  }
}
