import { Response } from 'express';
import { json } from 'body-parser';
import RequestWithRawBody from './requestWithRawBody.interface';

function rawbodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      response: Response,
      buffer: Buffer,
    ) => {
      if (
        request.url === '/online-payments/stripe/webhook' &&
        Buffer.isBuffer(buffer)
      ) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}

export default rawbodyMiddleware;
