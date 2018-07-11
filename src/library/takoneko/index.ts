import { stringify } from 'query-string';

export default class Takoneko {
  constructor(private accessToken: string, private apiBase = 'https://api.github.com') {
  }

  async requset(method: string, path: string, body: object | null = null, query: object | null = null) {
    const url = this.toURL(path, query);
    const option: any = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${this.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      method: method,
      redirect: 'follow',
    };
    if (body) {
      option.body = JSON.stringify(body);
    }

    return fetch(url, option);
  }

  private toURL(path: string, query: object | null) {
    const q = this.queryString(query);
    return `${this.apiBase}${path}${q}`;
  }

  private queryString(query: object | null) {
    if (!query) { return ''; }
    const q = stringify(query);
    if (q.length === 0) {
      return '';
    }
    return '?' + q;
  }
}
