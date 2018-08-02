import Electron, { ipcMain } from 'electron';
import { flatten } from 'lodash-es';

import ConfigManager from './ConfigManager';
import ChannelAggregator from './ChannelAggregator';
import { ConfigurationChannel, NotificationsChannel } from '../share/ipcChannels';
import { Category } from '../share/configuration';
import { NotificationsSession } from './db';

export default async () => {
  ipcMain.on(ConfigurationChannel.Request, async (event: Electron.Event) => {
    console.log(`receive ${ConfigurationChannel.Request}`);
    const conf = await ConfigManager.load();
    console.log(`send ${ConfigurationChannel.Response}`);
    event.sender.send(ConfigurationChannel.Response, conf);
  });

  ipcMain.on(NotificationsChannel.Request, async (event: Electron.Event, categoryID: string) => {
    console.log(`receive ${NotificationsChannel.Request}`);
    const category = await findCategory(categoryID);
    const cursor = NotificationsSession.conn.findWithCursor(category.query);
    const notifications = await cursor.sort({ updated_at: -1 }).exec();
    event.sender.send(NotificationsChannel.Response, notifications);
    console.log(`send ${NotificationsChannel.Response}`);
  });

  ChannelAggregator.start();
};

const findCategory = async (id: string): Promise<Category> => {
  const conf = await ConfigManager.load();
  const category = flatten(Object.keys(conf).map(key => conf[key].categories)).find(x => x.id === id);
  if (!category) {
    throw `Category ${id} does not found!`;
  }
  return category;
};

// For debug
process.on('unhandledRejection', console.dir);
