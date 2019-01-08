import { ToygerStore } from './ToygerStore';
import { reducer } from './reducer';
import { ipcRenderer } from 'electron';
import { markAsReadAction, markAsUnreadAction, refreshIssuesAction } from './ActionCreator';
import EventEmitter from 'events';

export const Store = new ToygerStore(reducer);
export const StoreEvent = new EventEmitter();

ipcRenderer.on('mark-as-read-issue', async (_ev: Electron.Event, issueID: number) => {
  Store.dispatch(await markAsReadAction(issueID));
});

ipcRenderer.on('mark-as-unread-issue', async (_ev: Electron.Event, issueID: number) => {
  Store.dispatch(await markAsUnreadAction(issueID));
});

StoreEvent.on('refresh-issues', async () => {
  const state = Store.state;
  if (!state) return;
  const { accounts, selectedChannelID, filter, selectedAccountID } = state;
  if (!selectedChannelID) return;
  if (!accounts) return;
  const account = accounts.find(a => a.ID === selectedAccountID);
  if (!account) return;

  Store.dispatch(await refreshIssuesAction(selectedChannelID, filter, account.UrlBase));
});
