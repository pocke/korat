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

  onResize() {
    const { x, y, width, height } = this.el.current!.getBoundingClientRect() as DOMRect;
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
    return <div style={{ width: '100%', height: '100%' }} ref={this.el} />;
  }
}
