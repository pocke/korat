import { ToygerStore } from './ToygerStore';
import { reducer } from './reducer';
import { AppState } from './AppState';
import { ipcRenderer } from 'electron';
import { markAsReadAction, markAsUnreadAction } from './ActionCreator';

export const Store = new ToygerStore<AppState>(reducer);

ipcRenderer.on('mark-as-read-issue', async (_ev: Electron.Event, issueID: number) => {
  Store.dispatch(await markAsReadAction(issueID));
});

ipcRenderer.on('mark-as-unread-issue', async (_ev: Electron.Event, issueID: number) => {
  Store.dispatch(await markAsUnreadAction(issueID));
});
