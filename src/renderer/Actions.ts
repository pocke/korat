import { flatMap } from 'lodash-es';
import { ipcRenderer } from 'electron';

import { mergeStore, currentStore, selectedAccount } from './Store';
import { Account, Issue, fetchIssues } from './API';
import { issueURL } from '../utils';

export const updateAccounts = (accounts: Account[]) => {
  mergeStore({ accounts });
};

export const updateIssues = (issues: Issue[]) => {
  const { UrlBase } = selectedAccount();
  issues
    .filter(i => i.AlreadyRead)
    .slice(0, 7)
    .forEach(i => ipcRenderer.send('browser-view-prefetch', issueURL(i, UrlBase)));
  issues
    .filter(i => !i.AlreadyRead)
    .slice(0, 7)
    .forEach(i => ipcRenderer.send('browser-view-prefetch', issueURL(i, UrlBase)));
  mergeStore({ issues });
};

export const selectChannel = (selectedChannelID: number, selectedAccountID: number) => {
  mergeStore({ selectedChannelID, selectedAccountID });
};

export const openEvent = (webviewURL: string) => {
  mergeStore({ webviewURL });
};

export const markAsRead = (id: number) => {
  const issues = currentStore().issues.map(issue => {
    if (issue.ID === id) {
      return {
        ...issue,
        AlreadyRead: true,
      };
    } else {
      return issue;
    }
  });
  mergeStore({ issues });
};

export const updateUnreadCount = (channelID: number, UnreadCount: number) => {
  const cur = currentStore();
  const { channel, accountID } = flatMap(cur.accounts!, (a: Account) =>
    a.Channels.map(channel => ({ channel, accountID: a.ID })),
  ).find(x => x.channel.ID === channelID)!;

  const accounts = cur.accounts!.map((a: Account) => {
    if (a.ID === accountID) {
      return {
        ...a,
        Channels: a.Channels.map(ch => (ch.ID === channel.ID ? { ...ch, UnreadCount } : ch)),
      };
    } else {
      return a;
    }
  });
  mergeStore({ accounts });
};

export const updateOnlyUnreadIssues = async (onlyUnreadIssue: boolean) => {
  const cur = currentStore();
  const { UrlBase } = selectedAccount();

  const issues = await fetchIssues(cur.selectedChannelID!, { onlyUnreadIssue });
  issues
    .filter(i => i.AlreadyRead)
    .slice(0, 7)
    .forEach(i => ipcRenderer.send('browser-view-prefetch', issueURL(i, UrlBase)));
  issues
    .filter(i => !i.AlreadyRead)
    .slice(0, 7)
    .forEach(i => ipcRenderer.send('browser-view-prefetch', issueURL(i, UrlBase)));

  console.log(issues);
  mergeStore({ onlyUnreadIssue, issues });
};
