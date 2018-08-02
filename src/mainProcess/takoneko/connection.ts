import fetch, { RequestInit, Headers } from 'node-fetch';
import { stringify } from 'query-string';

import { App } from './middleware/app';
import { TimerMiddleware } from './middleware/timer';
import { LoggerMiddleware } from './middleware/logger';

export default class Connection {
  private readonly app: App;
  constructor(private accessToken: string, private apiBase = 'https://api.github.com') {
    this.app = new App([LoggerMiddleware, TimerMiddleware], fetch);
  }

  async get(path: string, options: { body?: object; query?: object; headers?: Headers } = {}) {
    return this.request('GET', path, options);
  }

  async request(method: string, path: string, options: { body?: object; query?: object; headers?: Headers } = {}) {
    const url = this.toURL(path, options.query);
    const headers = options.headers || new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `token ${this.accessToken}`);
    headers.append('Accept', 'application/vnd.github.v3+json');
    const fetchOption: RequestInit = {
      headers: headers,
      method: method,
      redirect: 'follow',
    };
    if (options.body) {
      fetchOption.body = JSON.stringify(options.body);
    }

    return await this.app.run(url, fetchOption);
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
