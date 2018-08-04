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

  async import(items: any[], pk: string[]) {
    return Promise.all(
      items.map(async item => {
        const query = pick(item, pk);
        return this.conn.update(query, { $set: item }, { upsert: true });
      }),
    );
  }
}

export const IssuesSession = new Session('issues');

export const importIssues = async (issues: Item[], channel_id: string) => {
  console.log(`Importing ${issues.length} issues to DB`);
  const issuesWithChannelID = issues.map(issue => {
    const res: any = { ...issue };
    res[channel_id] = true;
    return res;
  });
  return IssuesSession.import(issuesWithChannelID, ['id']);
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

export const updateIssueRead = async (id: number, read: boolean): Promise<any> => {
  return IssuesSession.conn.update({ id }, { $set: { read } }, {});
};

// TODO support pagination
export const findAllIssues = async (channel_id: string): Promise<Item[]> => {
  const q: any = {};
  q[channel_id] = true;
  return IssuesSession.conn
    .findWithCursor(q)
    .sort({ updated_at: -1 })
    .limit(100)
    .exec();
};

IssuesSession.conn.remove({ '9772452cd2dad1e611ee35ee6d60c3c3': true });
