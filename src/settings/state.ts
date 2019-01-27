import { Account } from '../renderer/API';

export type Tabs = 'accounts' | 'channels';

export interface AppState {
  selectedTab: Tabs;
  accounts: Account[] | null;
  selectedAccountID: number | null;
}

export type setStateT = (state: Partial<AppState>) => void;
