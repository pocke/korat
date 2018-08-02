import { Semaphore } from '@pocke/await-semaphore';
import { RequestInit } from 'node-fetch';
import url from 'url';

import { FetchType } from './app';

class Timer {
  private interval: number;
  private s: Semaphore;
  constructor(options: { interval: number; concurrency: number }) {
    this.s = new Semaphore(options.concurrency);
    this.interval = options.interval;
  }

  async do<T>(f: () => T): Promise<T> {
    const release = await this.s.acquire();
    try {
      return f();
    } finally {
      setTimeout(() => {
        release();
      }, this.interval);
    }
  }
}

const MainTimer = new Timer({ interval: 6000, concurrency: 2 });
const SearchTimer = new Timer({ interval: 0, concurrency: 5 });

export const TimerMiddleware = (app: FetchType): FetchType => {
  return async (u: string, init: RequestInit) => {
    const parsedURL = url.parse(u);
    const timer = parsedURL.path!.startsWith('/search') ? SearchTimer : MainTimer;
    return timer.do(() => app(u, init));
  };
};
