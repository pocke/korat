import { Notification } from '../mainProcess/models/Notification';

export interface Configuration {
  [key: string]: ConfigForEndPoint;
}

export interface ConfigForEndPoint {
  urlBase: string;
  apiUrlBase: string;
  accessToken: string;
  categories: Category[];
}

export interface Category {
  displayName: string;
  id: string;
  order: number;
  query: {
    participating?: boolean;
    reasons?: Notification['reason'][];
  };
}
