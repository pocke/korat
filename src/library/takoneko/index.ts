import fetch, { Response, RequestInit, Headers } from 'node-fetch';
import { pick } from 'lodash-es';
import { stringify } from 'query-string';
import shortid from 'shortid';

import { Notification } from '../../mainProcess/models/Notification';

export default class Takoneko {
  constructor(private accessToken: string, private apiBase = 'https://api.github.com') {}

  async get(path: string, options: { body?: object; query?: object } = {}) {
    return this.requset('GET', path, options);
  }

  async requset(method: string, path: string, options: { body?: object; query?: object } = {}) {
    const url = this.toURL(path, options.query);
    const headers = new Headers();
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

  async notifications(
    options: { all?: boolean; participating?: boolean; since?: string; before?: string } = {},
  ): Promise<{ resp: Response; body: Notification[] }> {
    const query = pick(options, ['all', 'participating', 'since', 'before']);
    const resp = await this.get('/notifications', { query });
    const body = (await resp.json()) as Notification[];
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
