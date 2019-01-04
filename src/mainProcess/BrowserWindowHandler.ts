import { BrowserWindow, BrowserView, ipcMain, app } from 'electron';
import { times } from 'lodash-es';

let mainWindow: Electron.BrowserWindow;
const PREFETCH_ENABLED = process.env.KORAT_ENABLE_PREFETCH;

export const setMainWindow = (w: Electron.BrowserWindow) => {
  mainWindow = w;
};

class ViewPool {
  private pool: Array<Electron.BrowserView>;
  private urls: Array<string>;
  private wins: Array<Electron.BrowserWindow>;
  private openedIdx: number;
  private headIdx: number;

  constructor(private length: number) {
    this.urls = times(this.length, () => '');
    this.pool = times(this.length, () => new BrowserView({ webPreferences: { nodeIntegration: false } }));
    this.wins = times(this.length, n => {
      const w = new BrowserWindow({ width: 100, height: 100, show: false });
      w.setBrowserView(this.pool[n]);
      return w;
    });

    this.openedIdx = 0;
    this.headIdx = 0;
  }

  prefetch(url: string) {
    if (this.findByURL(url)) {
      return;
    }
    const idx = this.nextIdx();
    this.urls[idx] = url;
    this.pool[idx].webContents.loadURL(url);
  }

  open(url: string) {
    this.prefetch(url);
    const view = this.findByURL(url)!;
    this.openedIdx = view.idx;
    return view.conn;
  }

  setBounds(size: Size) {
    this.pool.forEach(v => {
      v.setBounds(size);
    });
  }

  private findByURL(url: string) {
    const idx = this.urls.indexOf(url);
    if (idx === -1) {
      return null;
    }
    return { conn: this.pool[idx], idx };
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
  viewPool = PREFETCH_ENABLED ? new ViewPool(10) : new ViewPool(1);
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

ipcMain.on('browser-view-load-url', (_event: any, url: string) => {
  console.log('browser-view-load-url', url);
  const view = viewPool.open(url);
  mainWindow.setBrowserView(view);
});

ipcMain.on('browser-view-prefetch', (_event: any, url: string) => {
  if (!PREFETCH_ENABLED) return;

  console.log('browser-view-prefetch', url);
  viewPool.prefetch(url);
});
