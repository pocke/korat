import * as React from 'react';

import SideBar from './SideBar';
import EventBar from './EventBar';
import * as styles from './App.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.main}>
        <SideBar />
        <EventBar />
        <webview src="https://github.com" className={styles.webview}/>
      </div>
    );
  }
}
