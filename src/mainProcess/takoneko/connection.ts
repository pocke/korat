import fetch, { Response, RequestInit, Headers } from 'node-fetch';
import { stringify } from 'query-string';
import shortid from 'shortid';

import Timer from './Timer';

const MainTimer = new Timer({ interval: 6000, concurrency: 2 });
const SearchTimer = new Timer({ interval: 0, concurrency: 5 });

export default class Connection {
  constructor(private accessToken: string, private apiBase = 'https://api.github.com') {}

  async get(path: string, options: { body?: object; query?: object; headers?: Headers } = {}) {
    return this.requset('GET', path, options);
  }

  async requset(method: string, path: string, options: { body?: object; query?: object; headers?: Headers } = {}) {
    const timer = path.startsWith('/search') ? SearchTimer : MainTimer;
    await timer.do(() => {});

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

    return await this.fetchWithLog(url, fetchOption);
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

  private async fetchWithLog(url: string, fetchOption: RequestInit) {
    const id = shortid.generate();
    this.logRequest(id, url, fetchOption);
    const resp = await fetch(url, fetchOption);
    this.logResponse(id, resp);
    return resp;
  }

  private logRequest(id: string, url: string, fetchOption: RequestInit) {
    this.log(id, `request: ${fetchOption.method} ${url}`);
    const headers = fetchOption.headers as Headers;
    this.logHeaders(id, headers);
  }

  private logResponse(id: string, resp: Response) {
    this.log(id, `response: Status ${resp.status}`);
    this.logHeaders(id, resp.headers);
  }

  private logHeaders(id: string, headers: Headers) {
    let mes = 'response: ';
    headers.forEach((value, name) => {
      const content = value.replace(/^token \w{40}$/, 'token xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      mes += `${name}: ${content}`;
      mes += '\n';
    });
    this.log(id, mes);
  }

  private log(id: string, message: string) {
    console.log(`[${new Date().toISOString()}] [Takoneko - ${id}]: ${message}`);
  }
}
