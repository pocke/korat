export interface Configuration {
  [key: string]: ConfigForEndPoint;
}

export interface ConfigForEndPoint {
  urlBase: string;
  apiUrlBase: string;
  accessToken: string;
  channels: Channel[];
}

export interface Channel {
  displayName: string;
  id: string;
  query: string;
}
