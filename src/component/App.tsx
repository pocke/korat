import * as React from 'react';
import { ipcRenderer } from 'electron';

import SideBar from './SideBar';
import EventBar from './EventBar';
import * as styles from './App.scss';
import { requestConfiguration, responseConfiguration } from '../share/ipcChannels';
import Configuration from '../share/configuration';

export default class App extends React.Component {
  constructor(props: any) {
    super(props);

    ipcRenderer.on(responseConfiguration, (_event: any, config: Configuration) => {
      console.log(config);
    });
    ipcRenderer.send(requestConfiguration);
  }

  render() {
    return (
      <div className={styles.main}>
        <SideBar />
        <EventBar />
        <webview src="https://github.com" className={styles.webview} />
      </div>
    );
  }
}
