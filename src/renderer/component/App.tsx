import * as React from 'react';

import SideBar from './SideBar';
import EventBar, { EmptyEventBar } from './EventBar';
import * as styles from './App.scss';
import { StoreT } from '../Store';
import { fetchAccounts } from '../API';
import { updateAccounts } from '../Actions';
import { wsOpen } from '../WSAPI';

type Props = StoreT;

export default class App extends React.Component<Props> {
  async componentDidMount() {
    await this.fetchAccounts();
    wsOpen();
  }

  private async fetchAccounts() {
    const accounts = await fetchAccounts();
    updateAccounts(accounts);
  }

  render() {
    const { accounts, selectedAccountID, issues, webviewURL } = this.props;
    if (!accounts) {
      return this.renderLoading();
    }

    console.log(accounts);
    console.log('endpoint', selectedAccountID);
    return (
      <div className={styles.main}>
        <SideBar accounts={accounts} />
        {issues.length === 0 ? (
          <EmptyEventBar />
        ) : (
          <EventBar
            urlBase={accounts.find(a => a.ID === selectedAccountID)!.UrlBase}
            selectedAccountID={selectedAccountID!.toString()}
            issues={issues}
          />
        )}
        <webview src={webviewURL} className={styles.webview} />
      </div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }
}
