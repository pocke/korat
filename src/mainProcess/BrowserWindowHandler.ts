import { BrowserWindow, BrowserView, ipcMain, app } from 'electron';
import { times } from 'lodash-es';

let mainWindow: Electron.BrowserWindow;
const PREFETCH_ENABLED = process.env.KORAT_ENABLE_PREFETCH;

export const setMainWindow = (w: Electron.BrowserWindow) => {
  mainWindow = w;
};

class ViewPool {
  private pool: Array<Electron.BrowserView>;
  private wins: Array<Electron.BrowserWindow>;
  private openedIdx: number;
  private headIdx: number;

  constructor(private length: number) {
    this.pool = times(this.length, () => new BrowserView({ webPreferences: { nodeIntegration: false } }));
    this.wins = times(this.length, n => {
      const w = new BrowserWindow({ width: 100, height: 100, show: false });
      w.setBrowserView(this.pool[n]);
      return w;
    });

    this.openedIdx = 0;
    this.headIdx = 0;
  }

  async prefetch(url: string): Promise<BrowserView> {
    const v = this.findByURL(url);
    if (v) {
      console.log('cache hit: ', url);
      return v;
    }
    const idx = this.nextIdx();
    const view = this.pool[idx];
    const wc = view.webContents;
    return new Promise((resolve, _reject) => {
      wc.once('dom-ready', () => resolve(view));
      wc.loadURL(url);
    });
  }

  async open(url: string) {
    const view = await this.prefetch(url);
    this.openedIdx = this.pool.indexOf(view);
    return view;
  }

  setBounds(size: Size) {
    this.pool.forEach(v => {
      v.setBounds(size);
    });
  }

  private findByURL(url: string) {
    const view = this.pool.find(v => v.webContents.getURL() === url);
    return view;
  }

  private nextIdx(): number {
    if (this.length === 1) return this.headIdx;

    const nextIdx = this.headIdx === this.length - 1 ? 0 : this.headIdx + 1;
    this.headIdx = nextIdx;
    if (nextIdx === this.openedIdx) {
      return this.nextIdx();
    } else {
      return nextIdx;
    }
  }

  debug() {
    // HACK: to avoid unused field error of this.wins
    console.log(this.wins);
  }
}

let viewPool: ViewPool;
app.on('ready', () => {
  viewPool = PREFETCH_ENABLED ? new ViewPool(15) : new ViewPool(1);
});

interface Size {
  x: number;
  y: number;
  width: number;
  height: number;
}

ipcMain.on('browser-view-change-size', (_event: any, size: Size) => {
  console.log('browser-view-change-size', size);
  viewPool.setBounds(size);
});

ipcMain.on('browser-view-load-url', async (_event: any, url: string) => {
  console.log('browser-view-load-url', url);
  const view = await viewPool.open(url);
  mainWindow.setBrowserView(view);
});

ipcMain.on('browser-view-prefetch', (_event: any, url: string) => {
  if (!PREFETCH_ENABLED) return;

  console.log('browser-view-prefetch', url);
  viewPool.prefetch(url);
});
