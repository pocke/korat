import { BrowserView, ipcMain } from 'electron';

let mainWindow: Electron.BrowserWindow;
let view: Electron.BrowserView;

export const setMainWindow = (w: Electron.BrowserWindow) => {
  mainWindow = w;
  onSetMainWindow();
};

const onSetMainWindow = () => {
  view = new BrowserView({ webPreferences: { nodeIntegration: false } });
  mainWindow.setBrowserView(view);
};

interface Size {
  x: number;
  y: number;
  width: number;
  height: number;
}

ipcMain.on('browser-view-change-size', (_event: any, size: Size) => {
  console.log('browser-view-change-size', size);
  view.setBounds(size);
});

ipcMain.on('browser-view-load-url', (_event: any, url: string) => {
  console.log('browser-view-load-url', url);
  view.webContents.loadURL(url);
  mainWindow.setBrowserView(view);
});
