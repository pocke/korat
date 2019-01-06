import * as React from 'react';
import { ipcRenderer } from 'electron';

interface Props {
  url: string;
}

interface State {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class BrowserViewProxy extends React.Component<Props, State> {
  private el: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.el = React.createRef();
    this.state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    ipcRenderer.send('browser-view-load-url', this.props.url);
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  private onResize() {
    const current = this.el.current;
    if (!current) {
      return;
    }
    const { x, y, width, height } = current.getBoundingClientRect() as DOMRect;
    this.setState({ x, y, width, height });
  }

  componentDidUpdate(prevProps: Props, prevState: State, __: any) {
    if (prevProps.url !== this.props.url) {
      ipcRenderer.send('browser-view-load-url', this.props.url);
    }
    if (prevState !== this.state) {
      const { x, y, width, height } = this.state;
      ipcRenderer.send('browser-view-change-size', { x, y, width, height });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <AddressBar />
        <div style={{ width: '100%', height: '100%' }} ref={this.el} />
      </div>
    );
  }
}

interface AddressBarProps {}

interface AddressBarState {
  url: string;
}

class AddressBar extends React.Component<AddressBarProps, AddressBarState> {
  constructor(props: AddressBarProps) {
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
