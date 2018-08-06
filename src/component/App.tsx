import * as React from 'react';
import { ipcRenderer } from 'electron';

import SideBar from './SideBar';
import EventBar, { EmptyEventBar } from './EventBar';
import * as styles from './App.scss';
import { ConfigurationChannel, IssuesChannel, IssuesMarkAsReadChannel } from '../share/ipcChannels';
import { Item } from '../share/types/SearchIssuesResult';
import { Configuration } from '../share/configuration';

interface Props {}

interface State {
  configuration?: Configuration[];
  selectedChannelID?: string;
  selectedEndpointID?: string;
  issues: Item[];
  webviewURL: string;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configuration: undefined,
      selectedChannelID: undefined,
      issues: [],
      webviewURL: 'https://github.com',
    };
  }

  componentDidMount() {
    this.subscribeEvents();
    this.configrationSync();
  }

  private subscribeEvents() {
    ipcRenderer.on(ConfigurationChannel.Response, (_event: any, configuration: Configuration[]) => {
      this.setState({ configuration });
    });

    ipcRenderer.on(IssuesChannel.Response, (_event: any, issues: Item[]) => {
      console.log('Receive Issues');
      console.log(issues);
      this.setState({ issues });
    });
  }

  private configrationSync() {
    ipcRenderer.send(ConfigurationChannel.Request);
  }

  render() {
    const { configuration, selectedEndpointID, issues, webviewURL } = this.state;
    if (!configuration) {
      return this.renderLoading();
    }

    console.log(configuration);
    console.log('endpoint', selectedEndpointID);
    return (
      <div className={styles.main}>
        <SideBar configuration={configuration} onSelectChannel={this.selectChannel.bind(this)} />
        {issues.length === 0 ? (
          <EmptyEventBar />
        ) : (
          <EventBar
            urlBase={configuration.find(c => c.id === selectedEndpointID)!.urlBase}
            issues={issues}
            openEvent={this.openEvent.bind(this)}
            markAsRead={this.markAsRead.bind(this)}
          />
        )}
        <webview src={webviewURL} className={styles.webview} />
      </div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  selectChannel(selectedChannelID: string, selectedEndpointID: string) {
    ipcRenderer.send(IssuesChannel.Request, selectedChannelID);
    this.setState({ selectedChannelID, selectedEndpointID });
  }

  openEvent(url: string) {
    this.setState({ webviewURL: url });
  }

  markAsRead(id: number) {
    const issues = this.state.issues.map(issue => {
      if (issue.id === id) {
        return {
          ...issue,
          read: true,
        };
      } else {
        return issue;
      }
    });

    ipcRenderer.send(IssuesMarkAsReadChannel.Request, id, this.state.selectedEndpointID);
    this.setState({ issues });
  }
}
