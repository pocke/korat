import { ToygerStore } from './ToygerStore';
import { reducer } from './reducer';
import { AppState } from './AppState';

export const Store = new ToygerStore<AppState>(reducer);
