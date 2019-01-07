import { AppState } from './AppState';
import { flatMap } from 'lodash-es';
import {
  UpdateAccounts,
  RefreshIssues,
  SelectChannel,
  ActionTypes,
  OpenIssue,
  MarkAsRead,
  MarkAsUnread,
  UpdateUnreadCount,
  UpdateOnlyUnreadIssues,
} from './ActionCreator';

export const reducer = (currentState: AppState, action: ActionTypes): AppState => {
  switch (action.type) {
    case UpdateAccounts:
      return { ...currentState, accounts: action.accounts };
    case RefreshIssues:
      return { ...currentState, issues: action.issues };
    case SelectChannel:
      return { ...currentState, selectedAccountID: action.accountID, selectedChannelID: action.channelID };
    case OpenIssue:
      return { ...currentState, webviewURL: action.url };
    case MarkAsRead: {
      const issues = currentState.issues.map(issue => {
        if (issue.ID === action.issueID) {
          return {
            ...issue,
            AlreadyRead: true,
          };
        } else {
          return issue;
        }
      });
      return { ...currentState, issues };
    }
    case MarkAsUnread: {
      const issues = currentState.issues.map(issue => {
        if (issue.ID === action.issueID) {
          return {
            ...issue,
            AlreadyRead: false,
          };
        } else {
          return issue;
        }
      });
      return { ...currentState, issues };
    }
    case UpdateUnreadCount: {
      const { channel, accountID } = flatMap(currentState.accounts!, a =>
        a.Channels.map(channel => ({ channel, accountID: a.ID })),
      ).find(x => x.channel.ID === action.channelID)!;

      const accounts = currentState.accounts!.map(a => {
        if (a.ID === accountID) {
          return {
            ...a,
            Channels: a.Channels.map(ch => (ch.ID === channel.ID ? { ...ch, UnreadCount: action.unreadCount } : ch)),
          };
        } else {
          return a;
        }
      });
      return { ...currentState, accounts };
    }
    case UpdateOnlyUnreadIssues:
      return { ...currentState, onlyUnreadIssue: action.onlyUnreadIssues };
  }

  throw 'unreachable';
};
