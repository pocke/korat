import * as React from 'react';
import { AddressBar } from './InternalBrowser/AddressBar';
import { BrowserViewProxy } from './InternalBrowser/BrowserViewProxy';
import * as styles from './InternalBrowser.scss';

interface Props {
  url: string;
}

export class InternalBrowser extends React.Component<Props> {
  render() {
    return (
      <div className={styles.container}>
        <AddressBar />
        <BrowserViewProxy url={this.props.url} />
      </div>
    );
  }
}
