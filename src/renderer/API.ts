const URL_BASE = 'http://localhost:5427';

export interface Account {
  ID: number;
  DisplayName: string;
  UrlBase: string;
  ApiUrlBase: string;
  Channels: Channel[];
}

export interface Channel {
  ID: number;
  DisplayName: string;
  System: string | null;
  Queries: string[];
  UnreadCount: number;
}

export interface User {
  ID: number;
  Login: string;
  AvatarURL: string;
}

export interface Issue {
  ID: number;
  Number: number;
  Title: string;
  RepoOwner: string;
  RepoName: string;
  State: string;
  Locked: boolean;
  Comments: number;
  CreatedAt: string;
  UpdatedAt: string;
  ClosedAt: string | null;
  IsPullRequest: boolean;
  Body: string;
  AlreadyRead: boolean;
  Merged: boolean | null;

  User: User;
  Labels: Label[];
  Assignees: User[];
}

export interface Label {
  ID: number;
  Name: string;
  Color: string;
  Default: boolean;
}

export const fetchAccounts = async () => {
  const resp = await fetch(URL_BASE + '/accounts');
  return (await resp.json()) as Account[];
};

export const fetchIssues = async (channelID: number, option: { onlyUnreadIssue?: boolean } = {}) => {
  let u = URL_BASE + `/channels/${channelID}/issues`;
  if (option.onlyUnreadIssue) {
    u += '?onlyUnread=1';
  }
  const resp = await fetch(u);
  return (await resp.json()) as Issue[];
};

export const markAsRead = async (issueID: number) => {
  await fetch(URL_BASE + `/issues/${issueID}/markAsRead`, { method: 'PATCH' });
};

export const markAsUnread = async (issueID: number) => {
  await fetch(URL_BASE + `/issues/${issueID}/markAsUnread`, { method: 'PATCH' });
};
