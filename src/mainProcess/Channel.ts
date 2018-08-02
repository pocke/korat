import Client from './takoneko';
import { importIssues } from './db';
export default class Channel {
  private apiClient: Client;

  constructor(accessToken: string, apiUrlBase: string, private queryBase: string, private id: string) {
    this.apiClient = new Client(accessToken, apiUrlBase);
  }

  async start(): Promise<void> {
    return this.fetchAndSave();
  }

  async fetchAndSave(): Promise<void> {
    const q = this.queryBase;
    const { body } = await this.apiClient.searchIssues({ q, sort: 'updated', per_page: 100 });
    await importIssues(body.items, this.id);
  }
}
