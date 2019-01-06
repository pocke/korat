import { AppState } from './AppState';
// TODO
type ActionTypes = any;

export const reducer = (currentState: AppState, action: ActionTypes): AppState => {
  console.log(currentState);
  console.log(action);
  return (null as any) as AppState;
};
