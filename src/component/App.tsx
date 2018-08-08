import * as React from 'react';
import { ipcRenderer } from 'electron';

import SideBar from './SideBar';
import EventBar, { EmptyEventBar } from './EventBar';
import * as styles from './App.scss';
import { ConfigurationChannel } from '../share/ipcChannels';
import { StoreT } from '../Store';
import initIpcReceiver from '../ipcReceivers';

initIpcReceiver();

type Props = StoreT;

export default class App extends React.Component<Props> {
  componentDidMount() {
    this.configrationSync();
  }

  private configrationSync() {
    ipcRenderer.send(ConfigurationChannel.Request);
  }

  render() {
    const { configuration, selectedEndpointID, issues, webviewURL } = this.props;
    if (!configuration) {
      return this.renderLoading();
    }

    console.log(configuration);
    console.log('endpoint', selectedEndpointID);
    return (
      <div className={styles.main}>
        <SideBar configuration={configuration} />
        {issues.length === 0 ? (
          <EmptyEventBar />
        ) : (
          <EventBar
            urlBase={configuration.find(c => c.id === selectedEndpointID)!.urlBase}
            selectedEndpointID={selectedEndpointID!}
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
