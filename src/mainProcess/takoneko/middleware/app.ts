import { RequestInit, Response } from 'node-fetch';

export interface FetchType {
  (url: string, init: RequestInit): Promise<Response>;
}

interface Middleware {
  (f: FetchType): FetchType;
}

export class App {
  public readonly run: FetchType;
  constructor(stacks: Middleware[], app: FetchType) {
    this.run = stacks.reverse().reduce((ap, mid) => mid(ap), app);
  }
}
