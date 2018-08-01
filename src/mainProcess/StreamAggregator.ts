import { forIn } from 'lodash';

import ConfigManager from './ConfigManager';
import Client from './takoneko';
import Stream from './streams/Stream';

export default class StreamAggregator {
  static async start() {
    const config = await ConfigManager.load();
    forIn(config, async c => {
      const client = new Client(c.accessToken, c.apiUrlBase);
      const me = await client.me();
      const login = me.body.login;
      const q = `involves:${login} user:${login}`;
      const stream = new Stream(c.accessToken, c.apiUrlBase, q);
      stream.start();
    });
  }
  // constructor() {}
}
