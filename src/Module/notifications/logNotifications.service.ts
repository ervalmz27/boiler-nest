import { Inject, Injectable } from '@nestjs/common';
import { LOG_NOTIFICATION_PROVIDER } from '@/Helpers/contants';
import { LogNotification } from './entities/logNotification.entity';

@Injectable()
export class LogNotificationsService {
  constructor(
    @Inject(LOG_NOTIFICATION_PROVIDER)
    private readonly repository: typeof LogNotification,
  ) {}

  async storeLog(payload) {
    const {
      service_sender = 'GENERIC',
      requestPayload,
      responseData,
      statusCode,
      isSuccess = false,
    } = payload;
    return await this.repository.create({
      service_sender: service_sender,
      payload: JSON.stringify(requestPayload),
      response: JSON.stringify(responseData),
      statusCode: statusCode,
      is_success: isSuccess,
    });
  }
}
