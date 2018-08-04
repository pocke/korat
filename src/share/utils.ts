import crypto from 'crypto';

export const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
export const md5 = (str: string) =>
  crypto
    .createHash('md5')
    .update(str, 'utf8')
    .digest('hex');
