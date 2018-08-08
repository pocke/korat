import { ipcRenderer } from 'electron';

import { ConfigurationChannel, IssuesChannel, UnreadCountChannel } from '../share/ipcChannels';
import { Configuration } from '../share/configuration';
import { Item } from '../share/types/SearchIssuesResult';
import { updateConfiguration, updateIssues, updateUnreadCount } from './Actions';

const def = (ch: { Response: string }, f: Function) => {
  ipcRenderer.on(ch.Response, (_event: any, ...args: any[]) => {
    console.log(`${ch.Response} with ${args}`);
    f(...args);
  });
};

export default () => {
  def(ConfigurationChannel, (configuration: Configuration[]) => {
    updateConfiguration(configuration);
  });

  def(IssuesChannel, (issues: Item[]) => {
    updateIssues(issues);
  });

  def(UnreadCountChannel, (channel_id: string, count: number) => {
    updateUnreadCount(channel_id, count);
  });
};
