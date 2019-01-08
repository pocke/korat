import { Account, Issue } from './API';

export interface AppState {
  accounts?: Account[];
  selectedChannelID?: number;
  selectedAccountID?: number;
  issues: Issue[];
  webviewURL: string;
  onlyUnreadIssue: boolean;

  filter: Filter;
}

export interface Filter {
  issue: boolean;
  pullRequest: boolean;

  read: boolean;
  unread: boolean;

  closed: boolean;
  open: boolean;
  merged: boolean;
}
