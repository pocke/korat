// A tiny library for manage state

export interface Action {
  type: string;
}

export class ToygerStore<T> {
  private onUpdateCallback?: ((newState: T) => void);
  private state?: T;

  constructor(private reducer: (currentState: T, action: Action) => T) {}

  onUpdate(f: (newState: T) => void) {
    this.onUpdateCallback = f;
  }

  setInitialState(state: T) {
    this.state = state;
  }

  dispatch(action: Action) {
    const newState = this.reducer(this.state!, action);
    this.state = newState;
    this.onUpdateCallback!(newState);
  }
}
