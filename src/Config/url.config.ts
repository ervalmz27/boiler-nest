import * as dotenv from 'dotenv';
dotenv.config();

const currentEnv = process.env.APP_ENV || 'development';

let waUrl =
  currentEnv === 'DEVELOPMENT'
    ? 'http://localhost'
    : 'https://yingshun.onewisdom.asia';
export const WA_URL = waUrl;

export const API_BASEURL =
  process.env.APP_ENV === 'development'
    ? 'http://localhost:9001'
    : 'https://yingshun.onewisdom.asia';

export const PAYME_URL = 'https://sandbox.api.payme.hsbc.com.hk';
