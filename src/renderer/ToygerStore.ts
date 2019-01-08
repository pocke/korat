// A tiny library for manage state

import { ActionTypes } from './ActionCreator';

export class ToygerStore<T> {
  private onUpdateCallback?: ((newState: T) => void);
  public state?: T;

  constructor(private reducer: (currentState: T, action: ActionTypes) => T) {}

  onUpdate(f: (newState: T) => void) {
    this.onUpdateCallback = f;
  }

  setInitialState(state: T) {
    this.state = state;
  }

  dispatch(action: ActionTypes) {
    const newState = this.reducer(this.state!, action);
    this.state = newState;
    this.onUpdateCallback!(newState);
  }
}
