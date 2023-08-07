import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';

dotenv.config();

export default class Helpers {
  decrypt(ciphertext: string): object {
    const KEY = process.env.CRYPTO_KEY || '';

    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(originalText);
  }

  response(res, status, message = '', data?: any, error = ''): any {
    res.status(status).send({
      data,
      message,
      error,
    });
  }

  responseJson(
    res,
    success = false,
    data: any = [],
    message = '',
    code = 200,
  ): any {
    return res.status(code).send({
      success,
      data,
      message,
    });
  }

  castDate(date) {
    const arrDate = date.split('/');
    return arrDate[2] + '-' + arrDate[1] + '-' + arrDate[0];
  }
}
