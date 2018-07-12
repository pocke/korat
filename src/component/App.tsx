import * as React from 'react';

import SideBar from './SideBar';
import EventBar from './EventBar';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <SideBar />
        <EventBar />
        <webview src="https://github.com" />
      </div>
    );
  }
}
