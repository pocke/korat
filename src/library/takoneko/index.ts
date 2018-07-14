import fetch, { Response } from 'node-fetch';
import { pick } from 'lodash-es';
import { stringify } from 'query-string';

interface NotificationResult {
  id: string;
  unread: boolean;
  reason:
    | 'assign'
    | 'author'
    | 'comment'
    | 'invitation'
    | 'manual'
    | 'mention'
    | 'state_change'
    | 'subscribed'
    | 'team_mention';
  updated_at: string;
  last_read_at?: string;
  subject: {
    title: string;
    url: string;
    latest_comment_url: string;
    type: string;
  };
  repository: any; //TODO
  url: string;
  subscription_url: string;
}

export default class Takoneko {
  constructor(private accessToken: string, private apiBase = 'https://api.github.com') {}

  async get(path: string, options: { body?: object; query?: object } = {}) {
    return this.requset('GET', path, options);
  }

  async requset(method: string, path: string, options: { body?: object; query?: object } = {}) {
    const url = this.toURL(path, options.query);
    const fetchOption: any = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${this.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
      method: method,
      redirect: 'follow',
    };
    if (options.body) {
      fetchOption.body = JSON.stringify(options.body);
    }

    return fetch(url, fetchOption);
  }

  async notifications(
    options: { all?: boolean; participating?: boolean; since?: string; before?: string } = {},
  ): Promise<{ resp: Response; body: NotificationResult[] }> {
    const query = pick(options, ['all', 'participating', 'since', 'before']);
    const resp = await this.get('/notifications', { query });
    const body = (await resp.json()) as NotificationResult[];
    return { resp, body };
  }

  private toURL(path: string, query: object | undefined) {
    const q = this.queryString(query);
    return `${this.apiBase}${path}${q}`;
  }

  private queryString(query: object | undefined) {
    if (!query) {
      return '';
    }
    const q = stringify(query);
    if (q.length === 0) {
      return '';
    }
    return '?' + q;
  }
}
