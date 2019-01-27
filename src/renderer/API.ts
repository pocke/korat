import { Filter } from './AppState';

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

  // extended
  cached?: boolean;
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

export const fetchIssues = async (channelID: number, filter: Filter) => {
  const u = new URL(URL_BASE + `/channels/${channelID}/issues`);
  u.searchParams.append('filter', JSON.stringify(filter));
  const resp = await fetch(u as any); // HACK
  return (await resp.json()) as Issue[];
};

export const markAsRead = async (issueID: number) => {
  await fetch(URL_BASE + `/issues/${issueID}/markAsRead`, { method: 'PATCH' });
};

export const markAsUnread = async (issueID: number) => {
  await fetch(URL_BASE + `/issues/${issueID}/markAsUnread`, { method: 'PATCH' });
};

interface CreateAccountParam {
  DisplayName: string;
  AccessToken: string;
  UrlBase: string;
  ApiUrlBase: string;
}

export const createAccount = async (p: CreateAccountParam) =>
  await fetch(URL_BASE + '/accounts', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(p),
  });
