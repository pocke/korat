import { Account, Issue } from './API';

export interface StoreT {
  accounts?: Account[];
  selectedChannelID?: number;
  selectedAccountID?: number;
  issues: Issue[];
  webviewURL: string;
  onlyUnreadIssue: boolean;
}

let Store: StoreT = {
  issues: [],
  webviewURL: 'https://github.com',
  onlyUnreadIssue: false,
};

export const currentStore = () => Store;

// XXX: It does not support nested object.
export const mergeStore = (newStore: Partial<StoreT>) => {
  Store = { ...Store, ...newStore };
  if (_onUpdate) {
    _onUpdate(Store);
  }
};

export const selectedAccount = () => {
  return Store.accounts!.find(a => a.ID === Store.selectedAccountID)!;
};

export const selectedChannel = () => {
  return selectedAccount().Channels.find(c => c.ID === Store.selectedChannelID)!;
};

let _onUpdate: ((store: StoreT) => void) | null = null;

export const onUpdate = (f: (store: StoreT) => void) => {
  _onUpdate = f;
};
