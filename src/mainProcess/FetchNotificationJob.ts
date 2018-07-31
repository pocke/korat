import { pick, forIn } from 'lodash';
import { Headers } from 'node-fetch';

import Takoneko from './takoneko';
import ConfigManager from './ConfigManager';
import { ConfigForEndPoint } from '../share/configuration';
import { importNotifications, NotificationsSession } from './db';

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

  async fetchLatestNotifications(lastModified?: string) {
    const headers = new Headers();
    if (lastModified) {
      headers.append('If-Modified-Since', lastModified);
    }
    const { resp, body } = await this.client.notifications({ all: true, headers });

    if (resp.status === 200 && body.length !== 0) {
      await this.fetchOldNotifications(body[body.length - 1].updated_at);
      await importNotifications(body);
    }
    const intervalHeader = resp.headers.get('X-Poll-Interval');
    const interval = intervalHeader ? parseInt(intervalHeader) : 30;
    await sleep(interval * 1000);
    const nextLastModified = resp.headers.get('Last-Modified') || lastModified;
    this.fetchLatestNotifications(nextLastModified);
  }

  async fetchOldNotifications(lastUpdatedAt: string): Promise<undefined> {
    console.log('fetchOldNotifications');

    const { body } = await this.client.notifications({ all: true, before: lastUpdatedAt });

    if (body.length !== 0) {
      const q = pick(body[body.length - 1], ['id', 'updated_at']);
      const exist = await NotificationsSession.conn.findOne(q, { id: 1 });
      await importNotifications(body);
      if (!exist) {
        await this.fetchOldNotifications(body[body.length - 1].updated_at);
      } else {
        console.log('exist', exist);
      }
    }

    return;
  }
}
