import { forIn } from 'lodash';

import ConfigManager from './ConfigManager';
import Client from './takoneko';
import Channel from './Channel';

export default class ChannelAggregator {
  static async start() {
    const config = await ConfigManager.load();
    forIn(config, async c => {
      const client = new Client(c.accessToken, c.apiUrlBase);
      const me = await client.me();
      const login = me.body.login;
      const q = `involves:${login} user:${login}`;
      const ch = new Channel(c.accessToken, c.apiUrlBase, q);
      ch.start();
    });
  }
  // constructor() {}
}
