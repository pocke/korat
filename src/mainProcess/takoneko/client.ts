import { Headers, Response } from 'node-fetch';
import { pick } from 'lodash-es';
import moment from 'moment';

import Connection from './connection';
import SearchIssuesResult, { Milestone } from '../../share/types/SearchIssuesResult';
import User from '../../share/types/User';
import { Notification } from '../models/Notification';

export default class Client {
  private connection: Connection;
  constructor(accessToken: string, apiBase = 'https://api.github.com') {
    this.connection = new Connection(accessToken, apiBase);
  }

  async notifications(
    options: { all?: boolean; participating?: boolean; since?: string; before?: string; headers?: Headers } = {},
  ): Promise<{ resp: Response; body: Notification[] }> {
    const query = pick(options, ['all', 'participating', 'since', 'before']);
    const resp = await this.connection.get('/notifications', { query, headers: options.headers });
    const body = (resp.status === 200 ? await resp.json() : null) as Notification[];
    return { resp, body };
  }

  async searchIssues(options: {
    q: string;
    sort?: 'comments' | 'created' | 'updated';
    order?: 'asc' | 'desc';
    per_page?: number;
  }): Promise<{ resp: Response; body: SearchIssuesResult }> {
    const resp = await this.connection.get('/search/issues', { query: options });
    const body = this.cleanSeachIssueResult(resp.status === 200 ? await resp.json() : null);
    return { resp, body };
  }

  async me(): Promise<{ resp: Response; body: User }> {
    const resp = await this.connection.get('/user');
    const body = this.cleanUser(resp.status === 200 ? await resp.json() : null);
    return { resp, body };
  }

  private cleanSeachIssueResult(orig: SearchIssuesResult): SearchIssuesResult {
    return {
      ...pick(orig, ['total_count', 'incomplete_results']),
      items: orig.items.map(item => ({
        ...pick(item, ['id', 'number', 'title', 'state', 'locked', 'assignee', 'assignees', 'comments', 'body']),
        pull_request: !!item.pull_request,
        user: this.cleanUser(item.user),
        milestone: this.cleanMilestone(item.milestone),
        labels: item.labels.map(label => pick(label, ['id', 'name', 'color', 'default'])),
        created_at: moment(item.created_at as any).toDate(),
        updated_at: moment(item.updated_at as any).toDate(),
        closed_at: item.closed_at ? moment(item.closed_at as any).toDate() : undefined,
      })),
    };
  }

  private cleanUser(orig: User): User {
    return pick(orig, ['login', 'id']);
  }

  private cleanMilestone(m: Milestone | undefined): Milestone | undefined {
    if (!m) {
      return undefined;
    }
    return {
      ...pick(m, ['id', 'number', 'title', 'description', 'state']),
      created_at: moment(m.created_at as any).toDate(),
      updated_at: moment(m.updated_at as any).toDate(),
      closed_at: m.closed_at ? moment(m.closed_at as any).toDate() : undefined,
    };
  }
}
