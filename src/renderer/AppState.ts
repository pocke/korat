import { Account, Issue } from './API';

export interface AppState {
  accounts?: Account[];
  selectedChannelID?: number;
  selectedAccountID?: number;
  selectedIssueID?: number;
  issues: Issue[];
  webviewURL: string;

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
