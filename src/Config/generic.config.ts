import * as dotenv from 'dotenv';
dotenv.config();

export const allowRunningCron =
  process.env.ENABLE_CRON === 'true' ? true : false;
