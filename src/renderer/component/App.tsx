import * as React from 'react';

import SideBar from './SideBar';
import { EventBar } from './EventBar';
import * as styles from './App.scss';
import { StoreT } from '../Store';
import { fetchAccounts } from '../API';
import { updateAccounts } from '../Actions';
import { wsOpen } from '../WSAPI';
import { BrowserViewProxy } from './BrowserViewProxy';

type Props = StoreT;

export default class App extends React.PureComponent<Props> {
  async componentDidMount() {
    await this.fetchAccounts();
    wsOpen();
  }

  private async fetchAccounts() {
    const accounts = await fetchAccounts();
    updateAccounts(accounts);
  }

  render() {
    const { accounts, selectedAccountID, issues, webviewURL, onlyUnreadIssue } = this.props;
    if (!accounts) {
      return this.renderLoading();
    }

    const account = accounts.find(a => a.ID === selectedAccountID);
    return (
      <div className={styles.main}>
        <SideBar
          accounts={accounts}
          selectedChannelID={this.props.selectedChannelID}
          onlyUnreadIssue={onlyUnreadIssue}
        />
        <EventBar urlBase={account ? account.UrlBase : ''} issues={issues} onlyUnreadIssue={onlyUnreadIssue} />
        <div className={styles.webview}>
          <BrowserViewProxy url={webviewURL} />
        </div>
      </div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }
}
