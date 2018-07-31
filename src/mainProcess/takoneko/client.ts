import { Headers, Response } from 'node-fetch';
import { pick } from 'lodash-es';

import Connection from './connection';
import SearchIssuesResult from '../../share/types/search_issues_result';
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
    sort: ['comments', 'created', 'updated'];
    order: ['asc', 'desc'];
  }): Promise<{ resp: Response; body: unknown }> {
    const resp = await this.connection.get('/search/issues', { query: options });
    const body = this.cleanSeachIssueResult(resp.status === 200 ? await resp.json() : null);
    return { resp, body };
  }

  private cleanSeachIssueResult(orig: SearchIssuesResult): SearchIssuesResult {
    return {
      ...pick(orig, ['total_count', 'incomplete_results']),
      items: orig.items.map(item => ({
        ...pick(item, [
          'id',
          'number',
          'title',
          'state',
          'locked',
          'assignee',
          'assignees',
          'milestone',
          'comments',
          'created_at',
          'updated_at',
          'closed_at',
          'body',
        ]),
        pull_request: !!item.pull_request,
        user: pick(item.user, ['login', 'id']),
        labels: item.labels.map(label => pick(label, ['id', 'name', 'color', 'default'])),
      })),
    };
  }
}
