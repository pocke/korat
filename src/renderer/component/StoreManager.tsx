import * as React from 'react';
import { App } from './App';
import { Store } from '../Store';
import { AppState as State } from '../AppState';

interface Props {}

export class StoreManager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      issues: [],
      webviewURL: 'https://github.com',
      onlyUnreadIssue: false,
      filter: {
        issue: true,
        pullRequest: true,

        read: true,
        unread: true,

        closed: true,
        open: true,
        merged: true,
      },
    };
    Store.onUpdate((state: State) => this.setState(state));
    Store.setInitialState(this.state);
  }

  render() {
    return <App {...this.state} />;
  }
}
