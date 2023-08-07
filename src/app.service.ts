import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  serviceCheck(): string {
    return 'YoyoBEOK';
  }
}
