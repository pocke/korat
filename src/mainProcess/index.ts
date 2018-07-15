import Electron, { ipcMain } from 'electron';
import { flatten } from 'lodash-es';

import ConfigManager from './ConfigManager';
import FetchNotificationJob from './FetchNotificationJob';
import { ConfigurationChannel, NotificationsChannel } from '../share/ipcChannels';
import { Category } from '../share/configuration';
import { NotificationsSession } from './db';
import { Notification } from './models/Notification';

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
    const q = buildQuery(category.query);
    console.log(q);
    const notifications = await NotificationsSession.conn.find(q);
    event.sender.send(NotificationsChannel.Response, notifications);
    console.log(`send ${NotificationsChannel.Response}`);
  });

  FetchNotificationJob.start();
};

const findCategory = async (id: string): Promise<Category> => {
  const conf = await ConfigManager.load();
  const category = flatten(Object.keys(conf).map(key => conf[key].categories)).find(x => x.id === id);
  if (!category) {
    throw `Category ${id} does not found!`;
  }
  return category;
};

interface SearchQuery {
  reasons?: {
    $in: Notification['reason'][];
  };
}

const buildQuery = (query: Category['query']) => {
  const q: SearchQuery = {};
  if (query.participating !== undefined) {
    Object.assign(
      q,
      buildReasons(['assign', 'author', 'comment', 'invitation', 'manual', 'mention', 'state_change', 'team_mention']),
    );
  }

  if (query.reasons) {
    Object.assign(q, buildReasons(query.reasons));
  }
  return q;
};

const buildReasons = (reasons: Notification['reason'][]) => {
  if (reasons.length === 0) {
    return {};
  }

  return { reason: { $in: reasons } };
};
