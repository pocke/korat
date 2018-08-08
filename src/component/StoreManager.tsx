import * as React from 'react';
import App from './App';
import { Store, StoreT, onUpdate } from '../Store';

interface Props {}

export default class StoreManager extends React.Component<Props, StoreT> {
  constructor(props: Props) {
    super(props);
    this.state = Store;
    onUpdate((newState: StoreT) => this.setState(newState));
  }

  render() {
    return <App {...this.state} />;
  }
}
