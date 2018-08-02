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

  async import(items: any[], pk: string[]) {
    return Promise.all(
      items.map(async item => {
        const query = pick(item, pk);
        return this.conn.update(query, item, { upsert: true });
      }),
    );
  }
}

export const NotificationsSession = new Session('notifications');
export const IssuesSession = new Session('issues');
export const IssueChannelRelationsSession = new Session('issue_channel_relations');

export const importIssues = async (issues: Item[], channel_id: string) => {
  console.log(`Importing ${issues.length} issues to DB`);
  const issueStreamRelations = issues.map(issue => ({ issue_id: issue.id, channel_id }));
  return Promise.all([
    IssuesSession.import(issues, ['id']),
    IssueChannelRelationsSession.import(issueStreamRelations, ['issue_id', 'channel_id']),
  ]);
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
