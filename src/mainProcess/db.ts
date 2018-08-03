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

const findIssueByUpdatedAt = async (channel_id: string, order: -1 | 1): Promise<Item> => {
  const relations = (await IssueChannelRelationsSession.conn.find({ channel_id })) as {
    channel_id: string;
    issue_id: number;
  }[];
  const q = {
    id: { $in: relations.map(r => r.issue_id) },
  };
  const resp = await IssuesSession.conn
    .findWithCursor(q)
    .sort({ updated_at: order })
    .limit(1)
    .exec();
  return resp[0];
};

export const findOldestIssue = async (channel_id: string): Promise<Item> => {
  return findIssueByUpdatedAt(channel_id, 1);
};

export const findNewestIssue = async (channel_id: string): Promise<Item> => {
  return findIssueByUpdatedAt(channel_id, 1);
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
