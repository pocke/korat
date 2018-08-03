import moment from 'moment';

import Client from './takoneko';
import { importIssues, findOldestIssue, findNewestIssue } from './db';
import { Item } from '../share/types/SearchIssuesResult';

export default class Channel {
  private apiClient: Client;

  constructor(accessToken: string, apiUrlBase: string, private queryBase: string, private id: string) {
    this.apiClient = new Client(accessToken, apiUrlBase);
  }

  async start(): Promise<void> {
    const items = await this.fetchAndSave(this.queryBase);
    if (items.length !== 0) {
      this.fetchOldIssues();
    }
    this.fetchNewIssues();
  }

  async fetchAndSave(q: string): Promise<Item[]> {
    const { body } = await this.apiClient.searchIssues({ q, sort: 'updated', per_page: 100 });
    await importIssues(body.items, this.id);
    return body.items;
  }

  async fetchNewIssues(): Promise<void> {
    console.log('fetchNewIssues');
    const newest = await findNewestIssue(this.id);
    const updated_at = newest.updated_at;
    const q = this.queryBase + ` updated:>=${this.formatTime(updated_at)}`;
    await this.fetchAndSave(q);

    this.fetchNewIssues();
  }

  async fetchOldIssues(): Promise<void> {
    console.log('fetchOldIssues');
    const oldest = await findOldestIssue(this.id);
    const updated_at = oldest.updated_at;
    const q = this.queryBase + ` updated:<=${this.formatTime(updated_at)}`;

    const items = await this.fetchAndSave(q);
    if (items.length !== 0) {
      await this.fetchOldIssues();
    }
  }

  formatTime(date: Date): string {
    return moment(date)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
  }
}
