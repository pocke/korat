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

export const fetchAccounts = async () => {
  const resp = await fetch(URL_BASE + '/accounts');
  return (await resp.json()) as Account[];
};
