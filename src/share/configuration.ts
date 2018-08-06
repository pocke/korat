export interface Configuration {
  id: string;
  displayName: string;
  urlBase: string;
  apiUrlBase: string;
  accessToken: string;
  channels: Channel[];
}

export interface Channel {
  displayName: string;
  id: string;
  system?: 'team';
  query: string[]; // also allow string
}
