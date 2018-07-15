import path from 'path';
import Datastore from 'nedb';
import { Mutex } from '@pocke/await-semaphore';

import { Notification } from './models/Notification';

const HOME = process.env.HOME as string;

class Session {
  private conn: Nedb;
  private mutex: Mutex;

  constructor(private name: string) {
    const dbPath = path.join(HOME, `.cache/korat/${this.name}.nedb`);
    this.conn = new Datastore({ filename: dbPath });
    this.mutex = new Mutex();
    this.conn.loadDatabase((err: Error) => {
      if (err) {
        throw err;
      }
    });
  }

  async with(cb: (conn: Nedb) => any): Promise<any> {
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
  NotificationsSession.with((conn: Nedb) => {
    // TODO: error handling
    conn.insert(notifications);
  });
};
