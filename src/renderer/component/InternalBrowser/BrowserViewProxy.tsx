import * as React from 'react';
import { ipcRenderer } from 'electron';

interface Props {
  url: string;
}

export class BrowserViewProxy extends React.Component<Props> {
  private el: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.el = React.createRef();

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
    ipcRenderer.send('browser-view-change-size', { x, y, width, height });
  }

  componentDidUpdate(prevProps: Props, _prevState: any, __: any) {
    if (prevProps.url !== this.props.url) {
      ipcRenderer.send('browser-view-load-url', this.props.url);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return <div style={{ width: '100%', flexGrow: 1 }} ref={this.el} />;
  }
}
