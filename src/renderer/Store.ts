import { Configuration, Channel as ChannelOrig } from '../share/configuration';
import { Account, Issue } from './API';

export interface Channel extends ChannelOrig {
  unreadCount?: number;
}

export interface Endpoint extends Configuration {
  channels: Channel[];
}

export interface StoreT {
  accounts?: Account[];
  configuration?: Endpoint[];
  selectedChannelID?: number;
  selectedAccountID?: number;
  issues: Issue[];
  webviewURL: string;
}

let Store: StoreT = {
  issues: [],
  webviewURL: 'https://github.com',
};

export const currentStore = () => Store;

// XXX: It does not support nested object.
export const mergeStore = (newStore: Partial<StoreT>) => {
  Store = { ...Store, ...newStore };
  if (_onUpdate) {
    _onUpdate(Store);
  }
};

let _onUpdate: ((store: StoreT) => void) | null = null;

export const onUpdate = (f: (store: StoreT) => void) => {
  _onUpdate = f;
};
