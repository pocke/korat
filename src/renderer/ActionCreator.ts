import { fetchAccounts, Account, Issue, fetchIssues, markAsRead as markAsReadRequest } from './API';
import { ipcRenderer } from 'electron';
import { issueURL } from '../utils';

export const UpdateAccounts = 'UpdateAccounts';
export const RefreshIssues = 'RefreshIssues';
export const SelectChannel = 'SelectChannel';
export const OpenIssue = 'OpenIssue';
export const MarkAsRead = 'MarkAsRead';
export const UpdateUnreadCount = 'UpdateUnreadCount';
export const UpdateOnlyUnreadIssues = 'UpdateOnlyUnreadIssues';

interface UpdateAccountsType {
  type: typeof UpdateAccounts;
  accounts: Account[];
}

interface RefreshIssuesType {
  type: typeof RefreshIssues;
  issues: Issue[];
}

interface SelectChannelType {
  type: typeof SelectChannel;
  channelID: number;
  accountID: number;
}

interface OpenIssueType {
  type: typeof OpenIssue;
  url: string;
}

interface MarkAsReadType {
  type: typeof MarkAsRead;
  issueID: number;
}

interface UpdateUnreadCountType {
  type: typeof UpdateUnreadCount;
  channelID: number;
  unreadCount: number;
}

interface UpdateOnlyUnreadIssuesType {
  type: typeof UpdateOnlyUnreadIssues;
  onlyUnreadIssues: boolean;
}

export type ActionTypes =
  | UpdateAccountsType
  | RefreshIssuesType
  | SelectChannelType
  | OpenIssueType
  | MarkAsReadType
  | UpdateUnreadCountType
  | UpdateOnlyUnreadIssuesType;

export const updateAccountsAction = async (): Promise<UpdateAccountsType> => {
  const accounts = await fetchAccounts();
  return {
    type: UpdateAccounts,
    accounts,
  };
};

export const refreshIssuesAction = async (
  channelID: number,
  onlyUnreadIssue: boolean,
  urlBase: string,
): Promise<RefreshIssuesType> => {
  const issues = await fetchIssues(channelID, { onlyUnreadIssue });
  if (onlyUnreadIssue) {
    issues.slice(0, 14).forEach(i => ipcRenderer.send('browser-view-prefetch', issueURL(i, urlBase)));
  } else {
    issues
      .filter(i => i.AlreadyRead)
      .slice(0, 7)
      .forEach(i => ipcRenderer.send('browser-view-prefetch', issueURL(i, urlBase)));
    issues
      .filter(i => !i.AlreadyRead)
      .slice(0, 7)
      .forEach(i => ipcRenderer.send('browser-view-prefetch', issueURL(i, urlBase)));
  }
  return {
    type: RefreshIssues,
    issues,
  };
};

export const selectChannelAction = (channelID: number, accountID: number): SelectChannelType => {
  return {
    type: SelectChannel,
    channelID,
    accountID,
  };
};

export const openIssueAction = (url: string): OpenIssueType => {
  return {
    type: OpenIssue,
    url,
  };
};

export const markAsReadAction = (issueID: number): MarkAsReadType => {
  markAsReadRequest(issueID);
  return {
    type: MarkAsRead,
    issueID,
  };
};

export const updateUnreadCountAction = (channelID: number, unreadCount: number): UpdateUnreadCountType => {
  return {
    type: UpdateUnreadCount,
    channelID,
    unreadCount,
  };
};

export const updateOnlyUnreadIssuesAction = (onlyUnreadIssues: boolean): UpdateOnlyUnreadIssuesType => {
  return {
    type: UpdateOnlyUnreadIssues,
    onlyUnreadIssues,
  };
};
