import path from 'path';
import Datastore from 'nedb-promise-ts';
import { Mutex } from '@pocke/await-semaphore';

import { Notification } from './models/Notification';

const HOME = process.env.HOME as string;

class Session {
  private conn: Datastore;
  private mutex: Mutex;

  constructor(private name: string) {
    const dbPath = path.join(HOME, `.cache/korat/${this.name}.nedb`);
    this.conn = new Datastore({ filename: dbPath });
    this.mutex = new Mutex();
    this.conn.loadDatabase().catch((err: Error) => {
      throw err;
    });
  }

  async with(cb: (conn: Datastore) => any): Promise<any> {
    const release = await this.mutex.acquire();
    try {
      return cb(this.conn);
    } finally {
      release();
    }
  }
}

const NotificationsSession = new Session('notifications');

export const importNotifications = (notifications: Notification[]) => {
  NotificationsSession.with(async (conn: Datastore) => {
    // TODO: error handling
    await conn.insert(notifications);
  });
};
