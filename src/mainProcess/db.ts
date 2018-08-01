import path from 'path';
import Datastore from 'nedb-promise-ts';
import { pick } from 'lodash-es';

import { Notification } from './models/Notification';
import { Item } from '../share/types/SearchIssuesResult';

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

  async import(items: any[]) {
    return Promise.all(
      items.map(async item => {
        const query = pick(item, ['id']);
        return this.conn.update(query, item, { upsert: true });
      }),
    );
  }
}

export const NotificationsSession = new Session('notifications');
export const IssuesSession = new Session('issues');

export const importIssues = async (issues: Item[], stream_id: string) => {
  console.log(`Importing ${issues.length} issues to DB`);
  const data = issues.map(issue => ({ ...issue, stream_id }));

  return IssuesSession.import(data);
};

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
