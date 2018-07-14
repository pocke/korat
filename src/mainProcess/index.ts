import Electron, { ipcMain } from 'electron';

import ConfigManager from './ConfigManager';
import FetchNotificationJob from './FetchNotificationJob';
import { requestConfiguration, responseConfiguration } from '../share/ipcChannels';
import { init } from './db';

export default async () => {
  ipcMain.on(requestConfiguration, async (event: Electron.Event) => {
    const conf = await ConfigManager.load();
    event.sender.send(responseConfiguration, conf);
  });
  const job = new FetchNotificationJob();
  job.start();

  return await init();
};
