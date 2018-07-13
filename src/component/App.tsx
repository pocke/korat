import * as React from 'react';
import { ipcRenderer } from 'electron';
import { pick } from 'lodash-es';

import SideBar from './SideBar';
import EventBar from './EventBar';
import * as styles from './App.scss';
import { requestConfiguration, responseConfiguration } from '../share/ipcChannels';
import { Configuration, ConfigForEndPoint } from '../share/configuration';

interface ConfigurationInRenderer {
  [key: string]: Pick<ConfigForEndPoint, 'categories'>;
}

interface Props {}

interface State {
  configuration?: ConfigurationInRenderer;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { configuration: undefined };
  }

  componentDidMount() {
    this.configrationSync();
  }

  configrationSync() {
    ipcRenderer.on(responseConfiguration, (_event: any, config: Configuration) => {
      const newCofnig: ConfigurationInRenderer = {};
      Object.keys(config).forEach((key: string) => {
        newCofnig[key] = pick(config[key], 'categories');
      });
      this.setState({ configuration: newCofnig });
    });
    ipcRenderer.send(requestConfiguration);
  }

  render() {
    if (!this.state.configuration) {
      return this.renderLoading();
    }

    return (
      <div className={styles.main}>
        <SideBar configuration={this.state.configuration} />
        <EventBar />
        <webview src="https://github.com" className={styles.webview} />
      </div>
    );
  }

  renderLoading() {
    return <div>Loading...</div>;
  }
}
