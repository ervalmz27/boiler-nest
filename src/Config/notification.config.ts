import * as dotenv from 'dotenv';
dotenv.config();

export const WABLAS_URL = process.env.WABLAS_URL || 'https://solo.wablas.com';
export const WABLAS_TOKEN = process.env.WABLAS_TOKEN || '';
