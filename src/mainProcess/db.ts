import path from 'path';
import Datastore from 'nedb-promise-ts';
import { pick } from 'lodash-es';

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

  async import(items: Item[], pk: string[], channel_id: string) {
    return Promise.all(
      items.map(async item => {
        const query = pick(item, pk);
        const exist: Item = (await this.conn.findOne(query)) as any;
        if (exist) {
          if (exist.updated_at.getTime() === item.updated_at.getTime()) {
            console.log('same updated_at', exist.updated_at);
            const newItemQuery: any = {};
            newItemQuery[channel_id] = true;
            return this.conn.update(query, { $set: newItemQuery }, {});
          } else {
            console.log('diff updated_at: updating with unread...', exist.updated_at, item.updated_at);
            console.log({ ...item, read: false });
            return this.conn.update(query, { ...item, read: false }, {});
          }
        } else {
          console.log('new record');
          console.log({ ...item, read: false });
          return this.conn.insert({ ...item, read: false });
        }
      }),
    );
  }
}

export const IssuesSession = new Session('issues');

export const importIssues = async (issues: Item[], channel_id: string, endpoint_id: string) => {
  console.log(`Importing ${issues.length} issues to DB`);
  const issuesWithChannelID = issues.map(issue => {
    const res: any = { ...issue, endpoint_id };
    res[channel_id] = true;
    return res;
  });
  return IssuesSession.import(issuesWithChannelID, ['id', 'endpoint_id'], channel_id);
};

const findIssueByUpdatedAt = async (channel_id: string, order: -1 | 1): Promise<Item> => {
  const q: any = {};
  q[channel_id] = true;
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

export const updateIssueRead = async (id: number, endpoint_id: string, read: boolean): Promise<any> => {
  return IssuesSession.conn.update({ id, endpoint_id }, { $set: { read } }, {});
};

// TODO support pagination
export const findAllIssues = async (channel_id: string): Promise<Item[]> => {
  const q: any = {};
  q[channel_id] = true;
  console.log(q);
  return IssuesSession.conn
    .findWithCursor(q)
    .sort({ updated_at: -1 })
    .limit(100)
    .exec();
};

export const unreadCount = async (channel_id: string): Promise<number> => {
  const q: any = { read: false };
  q[channel_id] = true;
  return IssuesSession.conn.count(q) as Promise<number>;
};
