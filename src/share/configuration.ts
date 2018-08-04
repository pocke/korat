export interface Configuration {
  displayName: string;
  urlBase: string;
  apiUrlBase: string;
  accessToken: string;
  channels: Channel[];
}

export interface Channel {
  displayName: string;
  id: string;
  query: string[]; // also allow string
}
