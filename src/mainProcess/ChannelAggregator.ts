import { forIn } from 'lodash';

import ConfigManager from './ConfigManager';
import Channel from './Channel';

export default class ChannelAggregator {
  static async start() {
    const config = await ConfigManager.load();
    forIn(config, c => {
      c.channels.forEach(channelConfig => {
        const ch = new Channel(c.accessToken, c.apiUrlBase, channelConfig.query);
        ch.start();
      });
    });
  }
  // constructor() {}
}
