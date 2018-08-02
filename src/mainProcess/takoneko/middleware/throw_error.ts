import { RequestInit } from 'node-fetch';

import { FetchType } from './app';

export const ThrowErrorMiddleware = (app: FetchType): FetchType => {
  return async (u: string, init: RequestInit) => {
    const resp = await app(u, init);
    if (resp.status < 400) {
      return resp;
    }

    const body = await resp.text();
    // TODO: make error classes
    throw body;
  };
};
