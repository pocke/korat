import * as React from 'react';
import { ipcRenderer } from 'electron';

interface Props {}

interface State {
  url: string;
}

export class AddressBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { url: '' };

    this.onWillNavigate = this.onWillNavigate.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('browser-view-will-navigate', this.onWillNavigate);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('browser-view-will-navigate', this.onWillNavigate);
  }

  render() {
    return <div style={{ height: '20px' }}>{this.state.url}</div>;
  }

  private onWillNavigate(_event: Electron.Event, url: string) {
    console.log('onWillNavigate', url);
    this.setState({ url });
  }
}
