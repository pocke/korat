import { flatten } from 'lodash-es';

import ConfigManager from './ConfigManager';
import Fetcher from './Fetcher';
import Client from './takoneko';
import { Item } from '../share/types/SearchIssuesResult';
import { Configuration, Channel } from '../share/configuration';
import { importIssues } from './db';

export default class ChannelAggregator {
  static async start() {
    const config = await ConfigManager.load();
    config.forEach(c => this.startForEndpoint(c));
  }

  static async startForEndpoint(config: Configuration) {
    const { accessToken, apiUrlBase, channels } = config;
    const client = new Client(accessToken, apiUrlBase);
    const channelsWithSystem = await this.buildSystemChannels(client, channels);
    const optimized = this.optimize(channelsWithSystem);

    optimized.forEach(ch => {
      const onUpdate = async (issues: Item[]) => {
        await Promise.all(ch.filters.map(async filter => await importIssues(filter.filter(issues), filter.channel_id)));
      };
      const fetcher = new Fetcher(client, ch.query, onUpdate);
      fetcher.start();
    });

    return;
  }

  static async buildSystemChannels(client: Client, channels: Channel[]) {
    return Promise.all(
      channels.map(async ch => {
        if (!ch.system) {
          return ch;
        } else if (ch.system === 'team') {
          const teams = await client.teams();
          const query = teams.map(t => `team:${t}`).join(' ');
          return {
            ...ch,
            query: [query],
          };
        } else {
          throw `${ch.system} is unknown identifier!`;
        }
      }),
    );
  }

  static optimize(channels: Channel[]) {
    const filter = <T>(a: T) => a;
    return flatten(
      channels.map(ch =>
        ch.query.map(query => ({
          query,
          filters: [
            {
              filter: filter,
              channel_id: ch.id,
            },
          ],
        })),
      ),
    );
  }
}
