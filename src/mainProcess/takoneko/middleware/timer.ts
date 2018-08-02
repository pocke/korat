import { Semaphore } from '@pocke/await-semaphore';

import { AppT, OptionT } from './app';

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

export const TimerMiddleware = (app: AppT): AppT => {
  return async (method: string, path: string, options: OptionT) => {
    const timer = path.startsWith('/search') ? SearchTimer : MainTimer;
    return timer.do(() => app(method, path, options));
  };
};
