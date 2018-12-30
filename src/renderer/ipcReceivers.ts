import { ipcRenderer } from 'electron';

import { IssuesChannel, UnreadCountChannel } from '../share/ipcChannels';
import { Item } from '../share/types/SearchIssuesResult';
import { updateIssues, updateUnreadCount } from './Actions';

const def = (ch: { Response: string }, f: Function) => {
  ipcRenderer.on(ch.Response, (_event: any, ...args: any[]) => {
    console.log(`${ch.Response} with ${args}`);
    f(...args);
  });
};

export default () => {
  def(IssuesChannel, (issues: Item[]) => {
    updateIssues(issues);
  });

  def(UnreadCountChannel, (channel_id: string, count: number) => {
    updateUnreadCount(channel_id, count);
  });
};
