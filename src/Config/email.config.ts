import * as dotenv from 'dotenv';
import { DEVELOPMENT, PRODUCTION } from '@/Helpers/contants';

dotenv.config();

const config = {
  development: {
    email_sender: process.env.DEV_EMAIL_SENDER,
    email_cc: process.env.DEV_EMAIL_CC,
    email_bcc: process.env.DEV_EMAIL_BCC,
    sendgrid_apikey: process.env.DEV_SG_KEY,
  },
  production: {
    email_sender: process.env.PROD_EMAIL_SENDER,
    email_cc: process.env.PROD_EMAIL_CC,
    email_bcc: process.env.PROD_EMAIL_BCC,
    sendgrid_apikey: process.env.PROD_SG_KEY,
  },
};

let mailConfig;
switch (process.env.NODE_ENV) {
  case DEVELOPMENT:
    mailConfig = config.development;
    break;
  case PRODUCTION:
    mailConfig = config.production;
    break;
  default:
    mailConfig = config.development;
}

export default mailConfig;
