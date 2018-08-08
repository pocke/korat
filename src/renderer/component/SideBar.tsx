import * as React from 'react';

import * as styles from './SideBar.scss';
import { Configuration } from '../../share/configuration';
import { Channel } from '../Store';
import { ipcRenderer } from 'electron';
import { IssuesChannel } from '../../share/ipcChannels';
import { selectChannel } from '../Actions';

interface Props {
  configuration: Configuration[];
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
        <button onClick={() => this.onSelectChannel(c.id, endpointID)}>{c.displayName}</button>
        {c.unreadCount ? <span>{c.unreadCount}</span> : null}
      </div>
    );
  }

  onSelectChannel(selectedChannelID: string, selectedEndpointID: string) {
    ipcRenderer.send(IssuesChannel.Request, selectedChannelID);
    selectChannel(selectedChannelID, selectedEndpointID);
  }
}
