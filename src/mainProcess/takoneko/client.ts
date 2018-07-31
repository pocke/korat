import { Headers, Response } from 'node-fetch';
import { pick } from 'lodash-es';
import Connection from './connection';

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
}
