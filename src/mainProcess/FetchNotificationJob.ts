import { forIn } from 'lodash';

import Takoneko from '../library/takoneko';
import ConfigManager from './ConfigManager';
import { ConfigForEndPoint } from '../share/configuration';
import { importNotifications } from './db';

export default class FetchNotificationJob {
  async start() {
    const config = await ConfigManager.load();
    forIn(config, (c, _key) => {
      this.startLoop(c);
    });
  }

  private async startLoop(config: ConfigForEndPoint) {
    const client = new Takoneko(config.accessToken, config.apiUrlBase);
    const { body } = await client.notifications({ all: true });
    importNotifications(body);
  }
}
