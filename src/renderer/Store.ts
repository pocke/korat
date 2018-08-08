import { Configuration } from '../share/configuration';
import { Item } from '../share/types/SearchIssuesResult';

export interface StoreT {
  configuration?: Configuration[];
  selectedChannelID?: string;
  selectedEndpointID?: string;
  issues: Item[];
  webviewURL: string;
}

export let Store: StoreT = {
  issues: [],
  webviewURL: 'https://github.com',
};

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
