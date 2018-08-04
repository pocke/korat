import Electron, { ipcMain } from 'electron';

import { issuesIndex, issueMarkAsRead, issueMarkAsUnread } from './controllers/IssuesController';
import { configShow } from './controllers/ConfigurationControoler';
import {
  ConfigurationChannel,
  IssuesChannel,
  IssuesMarkAsReadChannel,
  IssuesMarkAsUnreadChannel,
} from '../share/ipcChannels';

const def = (ch: { Request: string; Response: string }, f: Function): void => {
  ipcMain.on(ch.Request, async (event: Electron.Event, ...args: any[]) => {
    console.log(`receive ${ch.Request} with ${args}`);
    const resp: any = await f(...args);
    event.sender.send(ch.Response, resp);
    console.log(`send ${ch.Response}`);
  });
};

export default () => {
  def(IssuesChannel, issuesIndex);
  def(IssuesMarkAsReadChannel, issueMarkAsRead);
  def(IssuesMarkAsUnreadChannel, issueMarkAsUnread);
  def(ConfigurationChannel, configShow);
};
