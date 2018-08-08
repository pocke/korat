import Electron from 'electron';

import { UnreadCountChannel } from '../share/ipcChannels';

let WebContents: Electron.WebContents = null!;

export const setWebContents = (w: Electron.WebContents) => {
  WebContents = w;
};

export const pushUnreadCount = (channel_id: string, count: number) => {
  WebContents.send(UnreadCountChannel.Response, channel_id, count);
};

export default WebContents;
