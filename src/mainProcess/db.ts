import path from 'path';
import Datastore from 'nedb-promise-ts';
import { pick } from 'lodash-es';

import { Notification } from './models/Notification';

const HOME = process.env.HOME as string;

class Session {
  public conn: Datastore;

  constructor(private name: string) {
    const dbPath = path.join(HOME, `.cache/korat/${this.name}.nedb`);
    this.conn = new Datastore({ filename: dbPath });
    this.conn.loadDatabase().catch((err: Error) => {
      throw err;
    });
  }
}

export const NotificationsSession = new Session('notifications');

export const importNotifications = async (notifications: Notification[]) => {
  console.log(`Importing ${notifications.length} notifications`);

  const conn = NotificationsSession.conn;
  return Promise.all(
    notifications.map(async n => {
      const query = pick(n, ['id']);
      return await conn.update(query, n, { upsert: true });
    }),
  );
};
