import * as React from 'react';
import { AddressBar } from './InternalBrowser/AddressBar';
import { BrowserViewProxy } from './InternalBrowser/BrowserViewProxy';

interface Props {
  url: string;
}

export class InternalBrowser extends React.Component<Props> {
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <AddressBar />
        <BrowserViewProxy url={this.props.url} />
      </div>
    );
  }
}
