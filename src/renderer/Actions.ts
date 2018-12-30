import { flatMap } from 'lodash-es';

import { mergeStore, currentStore, Endpoint } from './Store';
import { Account, Issue } from './API';

export const updateAccounts = (accounts: Account[]) => {
  mergeStore({ accounts });
};

export const updateConfiguration = (configuration: Endpoint[]) => {
  mergeStore({ configuration });
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
        read: true,
      };
    } else {
      return issue;
    }
  });
  mergeStore({ issues });
};

export const updateUnreadCount = (channel_id: string, unreadCount: number) => {
  const cur = currentStore();
  const { channel, endpoint_iD } = flatMap(cur.configuration!, (c: Endpoint) =>
    c.channels.map(channel => ({ channel, endpoint_iD: c.id })),
  ).find(a => a.channel.id === channel_id)!;

  const configuration = cur.configuration!.map((c: Endpoint) => {
    if (c.id === endpoint_iD) {
      return {
        ...c,
        channels: c.channels.map(ch => (ch.id === channel.id ? { ...ch, unreadCount } : ch)),
      };
    } else {
      return c;
    }
  });
  mergeStore({ configuration });
};
