import Client from '../takoneko';
import { importIssues } from '../db';
export default class Stream {
  private apiClient: Client;

  constructor(accessToken: string, apiUrlBase: string, private queryBase: string) {
    this.apiClient = new Client(accessToken, apiUrlBase);
  }

  async start(): Promise<void> {
    const q = this.queryBase;
    const { body } = await this.apiClient.searchIssues({ q, sort: 'updated', per_page: 100 });
    importIssues(body.items, 'me');
  }
}
