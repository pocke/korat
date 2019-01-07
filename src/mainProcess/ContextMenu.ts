import { Menu, MenuItem, BrowserWindow, Event, ipcMain, clipboard } from 'electron';
import { spawn } from 'child_process';

export const startContextMenu = () => {
  ipcMain.addListener('issuebox-contextmenu', (_ev: Event, issueID: number) => {
    const menu = Menu.buildFromTemplate([
      {
        label: 'Mark as Read',
        click: (_: MenuItem, win: BrowserWindow, _ev: Event) => {
          win.webContents.send('mark-as-read-issue', issueID);
        },
      },
      {
        label: 'Mark as Unread',
        click: (_: MenuItem, win: BrowserWindow, _ev: Event) => {
          win.webContents.send('mark-as-unread-issue', issueID);
        },
      },
    ]);
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      menu.popup({ window });
    }
  });

  ipcMain.addListener('browser-contextmenu-anchor', (_ev: Event, url: string) => {
    const menu = Menu.buildFromTemplate([
      {
        label: 'Open link in the external browser',
        click: (_: MenuItem, _win: BrowserWindow, _ev: Event) => {
          // TODO: Support other os
          spawn('xdg-open', [url]);
        },
      },
      {
        label: 'Copy link',
        click: (_: MenuItem, _win: BrowserWindow, _ev: Event) => {
          clipboard.writeText(url);
        },
      },
    ]);
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      menu.popup({ window });
    }
  });
};
