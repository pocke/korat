import { BrowserWindow, ipcMain, app } from 'electron';
import { ViewPool } from './ViewPool';

let mainWindow: BrowserWindow;
const PREFETCH_ENABLED = process.env.KORAT_ENABLE_PREFETCH;

let _ensureMainWindow: () => void;
const ensureMainWindow = new Promise(resolve => (_ensureMainWindow = resolve));

export const setMainWindow = (w: BrowserWindow) => {
  mainWindow = w;
  _ensureMainWindow();
};

let viewPool: ViewPool;
app.on('ready', async () => {
  viewPool = PREFETCH_ENABLED ? new ViewPool(15) : new ViewPool(1);
  await ensureMainWindow;
  viewPool.on('will-navigate', (url: string) => {
    mainWindow.webContents.send('browser-view-will-navigate', url);
  });
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
