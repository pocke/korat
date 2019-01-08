import * as React from 'react';

import { ChannelBar } from './ChannelBar';
import { EventBar } from './EventBar';
import * as styles from './App.scss';
import { AppState } from '../AppState';
import { wsOpen } from '../WSAPI';
import { InternalBrowser } from './InternalBrowser';
import { Store } from '../Store';
import { updateAccountsAction } from '../ActionCreator';

type Props = AppState;

export class App extends React.PureComponent<Props> {
  async componentDidMount() {
    await this.fetchAccounts();
    wsOpen();
  }

  private async fetchAccounts() {
    Store.dispatch(await updateAccountsAction());
  }

  render() {
    const { accounts, selectedAccountID, issues, webviewURL, onlyUnreadIssue } = this.props;
    if (!accounts) {
      return this.renderLoading();
    }

    const account = accounts.find(a => a.ID === selectedAccountID);
    return (
      <div className={styles.main}>
        <ChannelBar
          accounts={accounts}
          selectedChannelID={this.props.selectedChannelID}
          onlyUnreadIssue={onlyUnreadIssue}
        />
        <EventBar
          urlBase={account ? account.UrlBase : ''}
          issues={issues}
          onlyUnreadIssue={onlyUnreadIssue}
          selectedChannelID={this.props.selectedChannelID}
          account={account}
        />
        <InternalBrowser url={webviewURL} />
      </div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }
}
