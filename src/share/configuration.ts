export default interface Configuration {
  [key: string]: {
    urlBase: string;
    apiUrlBase: string;
    accessToken: string;
    categories: {
      displayName: string;
      id: number;
      order: number;
      query: {
        participating?: boolean;
      };
    }[];
  };
}
