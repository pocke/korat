import ConfigManager from './ConfigManager';
import Fetcher from './Fetcher';
import Client from './takoneko';
import { Item } from '../share/types/SearchIssuesResult';
import { Configuration, Channel as ChannelT } from '../share/configuration';
import { importIssues } from './db';

export default class ChannelAggregator {
  static async start() {
    const config = await ConfigManager.load();
    config.forEach(c => this.startForEndpoint(c));
  }

  static async startForEndpoint(config: Configuration) {
    const { accessToken, apiUrlBase, channels } = config;
    const client = new Client(accessToken, apiUrlBase);
    const optimized = this.optimize(channels);

    optimized.forEach(ch => {
      const onUpdate = async (issues: Item[]) => {
        await Promise.all(ch.filters.map(async filter => await importIssues(filter.filter(issues), filter.channel_id)));
      };
      const fetcher = new Fetcher(client, ch.query, onUpdate);
      fetcher.start();
    });

    return;
  }

  static optimize(channels: ChannelT[]) {
    const filter = <T>(a: T) => a;
    return channels.map(ch => ({
      query: ch.query,
      filters: [
        {
          filter: filter,
          channel_id: ch.id,
        },
      ],
    }));
  }
}
