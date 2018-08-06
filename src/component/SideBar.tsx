import * as React from 'react';

import * as styles from './SideBar.scss';
import { Configuration, Channel } from '../share/configuration';

interface Props {
  configuration: Configuration[];
  onSelectChannel: { (channelID: string, selectedEndpoint: string): void };
}

export default class Sidebar extends React.Component<Props> {
  render() {
    return <div className={styles.main}>{this.props.configuration.map(c => this.renderOneEndpoint(c))}</div>;
  }

  renderOneEndpoint(config: Configuration) {
    return (
      <div key={config.id}>
        <h2>{config.displayName}</h2>
        {config.channels.map(ch => this.renderChannel(ch, config.id))}
      </div>
    );
  }

  renderChannel(c: Channel, endpointID: string) {
    return (
      <div key={c.id}>
        <button onClick={() => this.props.onSelectChannel(c.id, endpointID)}>{c.displayName}</button>
      </div>
    );
  }
}
