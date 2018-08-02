import { Response, Headers } from 'node-fetch';

export interface AppT {
  (method: string, path: string, options: { body?: object; query?: object; headers?: Headers }): Promise<Response>;
}

export interface OptionT {
  body?: object;
  query?: object;
  headers?: Headers;
}
interface Middleware {
  (app: AppT): AppT;
}

export class App {
  public readonly run: AppT;
  constructor(stacks: Middleware[], app: AppT) {
    this.run = stacks.reverse().reduce((ap, mid) => mid(ap), app);
  }
}
