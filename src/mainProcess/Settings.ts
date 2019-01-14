import { BrowserWindow } from 'electron';

const APP_URL = `file://${__dirname}/../public/settings.html`;

export const openSettingsWindow = (parent: BrowserWindow) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    parent,
    modal: true,
    frame: false,
  });
  win.loadURL(APP_URL);
};
