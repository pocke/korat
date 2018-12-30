import { ipcRenderer } from 'electron';

import { UnreadCountChannel } from '../share/ipcChannels';
import { updateUnreadCount } from './Actions';

const def = (ch: { Response: string }, f: Function) => {
  ipcRenderer.on(ch.Response, (_event: any, ...args: any[]) => {
    console.log(`${ch.Response} with ${args}`);
    f(...args);
  });
};

export default () => {
  def(UnreadCountChannel, (channel_id: string, count: number) => {
    updateUnreadCount(channel_id, count);
  });
};
