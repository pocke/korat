import * as React from 'react';

import SideBar from './SideBar';
import EventBar, { EmptyEventBar } from './EventBar';
import * as styles from './App.scss';
import { StoreT } from '../Store';
import initIpcReceiver from '../ipcReceivers';
import { fetchAccounts } from '../API';
import { updateAccounts } from '../Actions';

initIpcReceiver();

type Props = StoreT;

export default class App extends React.Component<Props> {
  componentDidMount() {
    this.configrationSync();
  }

  private async configrationSync() {
    const accounts = await fetchAccounts();
    updateAccounts(accounts);
    // ipcRenderer.send(ConfigurationChannel.Request);
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
