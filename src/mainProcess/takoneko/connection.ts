import fetch, { RequestInit, Headers } from 'node-fetch';
import { stringify } from 'query-string';
import parseLinkHeader from 'parse-link-header';

import { App } from './middleware/app';
import { TimerMiddleware } from './middleware/timer';
import { LoggerMiddleware } from './middleware/logger';
import { ThrowErrorMiddleware } from './middleware/throw_error';

interface Options {
  body?: object;
  query?: object;
  headers?: Headers;
}

export default class Connection {
  private readonly app: App;
  constructor(private accessToken: string, private apiBase = 'https://api.github.com') {
    this.app = new App([ThrowErrorMiddleware, LoggerMiddleware, TimerMiddleware], fetch);
  }

  async get(path: string, options: Options = {}) {
    return this.request('GET', path, options);
  }

  async getWithPaginate(path: string, options: Options = {}) {
    const opts = {
      ...options,
      query: {
        ...options.query,
        page: 1,
        per_page: 100,
      },
    };
    const firstResp = await this.get(path, opts);
    const lastPage = this.lastPage(firstResp.headers);
    const resp = (await firstResp.json()) as any[];

    if (!lastPage) {
      return resp;
    }

    const reqs = [];
    for (let i = 1; i <= lastPage; ++i) {
      const optsForPaginate = {
        ...options,
        query: {
          ...opts.query,
          page: i,
        },
      };
      reqs.push(this.get(path, options));
    }

    const resps = await Promise.all(reqs);
    const jsons = (await Promise.all(resps.map(r => r.json()))) as any[][];
    return jsons.reduce((acc, cur) => acc.concat(cur), resp);
  }

  async request(method: string, path: string, options: Options = {}) {
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

  private lastPage(headers: Headers): number | null {
    const link = headers.get('link');
    if (!link) {
      return null;
    }
    const parsed = parseLinkHeader(link);
    if (!parsed) {
      return null;
    }
    const last = parsed['last'];
    if (!last) {
      return null;
    }
    return parseInt((last as any).page as string, 10);
  }
}
