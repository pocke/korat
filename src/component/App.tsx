import * as React from 'react';
import { ipcRenderer } from 'electron';
import { pick } from 'lodash-es';

import SideBar from './SideBar';
import EventBar from './EventBar';
import * as styles from './App.scss';
import { ConfigurationChannel, NotificationsChannel } from '../share/ipcChannels';
import { Configuration, ConfigForEndPoint } from '../share/configuration';
import { Notification } from '../mainProcess/models/Notification';

interface ConfigurationInRenderer {
  [key: string]: Pick<ConfigForEndPoint, 'categories'>;
}

interface Props {}

interface State {
  configuration?: ConfigurationInRenderer;
  selectedCategoryID?: string;
  notifications: Notification[];
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { configuration: undefined, selectedCategoryID: undefined, notifications: [] };
  }

  componentDidMount() {
    this.subscribeEvents();
    this.configrationSync();
  }

  private subscribeEvents() {
    ipcRenderer.on(ConfigurationChannel.Response, (_event: any, config: Configuration) => {
      const newCofnig: ConfigurationInRenderer = {};
      Object.keys(config).forEach((key: string) => {
        newCofnig[key] = pick(config[key], 'categories');
      });
      this.setState({ configuration: newCofnig });
    });

    ipcRenderer.on(NotificationsChannel.Response, (_event: any, notifications: Notification[]) => {
      console.log('Receive Notifications');
      console.log(notifications);
      this.setState({ notifications });
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
        <SideBar configuration={this.state.configuration} onSelectCategory={this.selectCategory.bind(this)} />
        <EventBar notifications={this.state.notifications} />
        <webview src="https://github.com" className={styles.webview} />
      </div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  selectCategory(categoryID: string) {
    ipcRenderer.send(NotificationsChannel.Request, categoryID);
    this.setState({ selectedCategoryID: categoryID });
  }
}
