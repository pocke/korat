import { Semaphore } from '@pocke/await-semaphore';

import { sleep } from '../../share/utils';

export default class Timer {
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
      await sleep(this.interval);
      release();
    }
  }
}
