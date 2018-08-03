import * as React from 'react';
import { ipcRenderer } from 'electron';
import { pick } from 'lodash-es';

import SideBar from './SideBar';
import EventBar from './EventBar';
import * as styles from './App.scss';
import { ConfigurationChannel, IssuesChannel } from '../share/ipcChannels';
import { Item } from '../share/types/SearchIssuesResult';
import { Configuration, ConfigForEndPoint } from '../share/configuration';

interface ConfigurationInRenderer {
  [key: string]: Pick<ConfigForEndPoint, 'channels'>;
}

interface Props {}

interface State {
  configuration?: ConfigurationInRenderer;
  selectedChannelID?: string;
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
    ipcRenderer.on(ConfigurationChannel.Response, (_event: any, config: Configuration) => {
      const newCofnig: ConfigurationInRenderer = {};
      Object.keys(config).forEach((key: string) => {
        newCofnig[key] = pick(config[key], 'channels');
      });
      this.setState({ configuration: newCofnig });
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
    if (!this.state.configuration) {
      return this.renderLoading();
    }

    return (
      <div className={styles.main}>
        <SideBar configuration={this.state.configuration} onSelectChannel={this.selectChannel.bind(this)} />
        <EventBar issues={this.state.issues} openEvent={this.openEvent.bind(this)} />
        <webview src={this.state.webviewURL} className={styles.webview} />
      </div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  selectChannel(channelID: string) {
    ipcRenderer.send(IssuesChannel.Request, channelID);
    this.setState({ selectedChannelID: channelID });
  }

  openEvent(url: string) {
    this.setState({ webviewURL: url });
  }
}
