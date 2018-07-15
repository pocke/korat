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
  query: any;
}
