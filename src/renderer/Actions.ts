import { flatMap } from 'lodash-es';

import { mergeStore, currentStore } from './Store';
import { Account, Issue } from './API';

export const updateAccounts = (accounts: Account[]) => {
  mergeStore({ accounts });
};

export const updateIssues = (issues: Issue[]) => {
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
