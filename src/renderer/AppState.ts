import { Account, Issue } from './API';

export interface AppState {
  accounts?: Account[];
  selectedChannelID?: number;
  selectedAccountID?: number;
  issues: Issue[];
  webviewURL: string;
  onlyUnreadIssue: boolean;
}
