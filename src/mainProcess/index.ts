import Electron, { ipcMain } from 'electron';

import ConfigManager from './ConfigManager';
import ChannelAggregator from './ChannelAggregator';
import { ConfigurationChannel, IssuesChannel } from '../share/ipcChannels';
import { findAllIssues } from './db';

export default async () => {
  ipcMain.on(ConfigurationChannel.Request, async (event: Electron.Event) => {
    console.log(`receive ${ConfigurationChannel.Request}`);
    const conf = await ConfigManager.load();
    console.log(`send ${ConfigurationChannel.Response}`);
    event.sender.send(ConfigurationChannel.Response, conf);
  });

  ipcMain.on(IssuesChannel.Request, async (event: Electron.Event, channel_id: string) => {
    console.log(`receive ${IssuesChannel.Request}`);
    const issues = await findAllIssues(channel_id);
    event.sender.send(IssuesChannel.Response, issues);
    console.log(`send ${IssuesChannel.Response}`);
  });

  ChannelAggregator.start();
};

// For debug
process.on('unhandledRejection', console.dir);
