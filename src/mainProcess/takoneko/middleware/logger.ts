import shortid from 'shortid';
import { RequestInit, Response, Headers } from 'node-fetch';

import { FetchType } from './app';

export const LoggerMiddleware = (app: FetchType): FetchType => {
  return async (url: string, init: RequestInit) => {
    const id = shortid.generate();
    logRequest(id, url, init);
    const resp = await app(url, init);
    logResponse(id, resp);
    return resp;
  };
};

// async fetchWithLog(url: string, fetchOption: RequestInit) {
//   const id = shortid.generate();
//   logRequest(id, url, fetchOption);
//   const resp = await fetch(url, fetchOption);
//   this.logResponse(id, resp);
//   return resp;
// }
//
const logRequest = (id: string, url: string, init: RequestInit) => {
  log(id, `request: ${init.method} ${url}`);
  const headers = init.headers as any; // TODO: runtime type validation
  logHeaders(id, headers);
};

const logResponse = (id: string, resp: Response) => {
  log(id, `response: Status ${resp.status}`);
  logHeaders(id, resp.headers);
};

const logHeaders = (id: string, headers: Headers) => {
  let mes = 'response: ';
  headers.forEach((value, name) => {
    const content = value.replace(/^token \w{40}$/, 'token xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    mes += `${name}: ${content}`;
    mes += '\n';
  });
  log(id, mes);
};

const log = (id: string, message: string) => {
  console.log(`[${new Date().toISOString()}] [Takoneko - ${id}]: ${message}`);
};
