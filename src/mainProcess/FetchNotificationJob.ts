import { forIn } from 'lodash';
import { Headers } from 'node-fetch';

import Takoneko from '../library/takoneko';
import ConfigManager from './ConfigManager';
import { ConfigForEndPoint } from '../share/configuration';
import { importNotifications } from './db';
// import { Notification } from './models/Notification';

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

export default class FetchNotificationJob {
  static async start() {
    const config = await ConfigManager.load();
    forIn(config, (c, _key) => {
      const job = new FetchNotificationJob(c);
      job.start();
    });
  }

  private client: Takoneko;
  constructor(private config: ConfigForEndPoint) {
    this.client = new Takoneko(this.config.accessToken, this.config.apiUrlBase);
  }

  start() {
    this.fetchLatestNotifications();
  }

  // TODO: fetch old notifications
  async fetchLatestNotifications(lastModified?: string) {
    const headers = new Headers();
    if (lastModified) {
      headers.append('If-Modified-Since', lastModified);
    }
    const { resp, body } = await this.client.notifications({ all: true, headers });

    if (resp.status === 200) {
      await importNotifications(body);
    }
    const intervalHeader = resp.headers.get('X-Poll-Interval');
    const interval = intervalHeader ? parseInt(intervalHeader) : 60;
    await sleep(interval * 1000);
    const nextLastModified = resp.headers.get('Last-Modified') || lastModified;
    this.fetchLatestNotifications(nextLastModified);
  }
}
