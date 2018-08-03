import * as React from 'react';

import * as styles from './SideBar.scss';
import { ConfigForEndPoint, Channel } from '../share/configuration';

type C = Pick<ConfigForEndPoint, 'channels'>;

interface ConfigurationInRenderer {
  [key: string]: C;
}

interface Props {
  configuration: ConfigurationInRenderer;
  onSelectChannel: { (channelID: string): void };
}

export default class Sidebar extends React.Component<Props> {
  render() {
    return (
      <div className={styles.main}>
        {Object.keys(this.props.configuration).map((key: string) =>
          this.renderOneEndpoint(key, this.props.configuration[key]),
        )}
      </div>
    );
  }

  renderOneEndpoint(name: string, config: C) {
    return (
      <div key={name}>
        <h2>{name}</h2>
        {config.channels.map(ch => this.renderChannel(ch))}
      </div>
    );
  }

  renderChannel(c: Channel) {
    return (
      <div key={c.id}>
        <button onClick={() => this.props.onSelectChannel(c.id)}>{c.displayName}</button>
      </div>
    );
  }
}
