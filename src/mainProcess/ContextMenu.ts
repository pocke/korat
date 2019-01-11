import { Menu, MenuItem, BrowserWindow, Event, ipcMain, clipboard } from 'electron';
import { spawn } from 'child_process';

// TODO: Support other os
const openBrowser = (url: string) => {
  spawn('xdg-open', [url]);
};

export const startContextMenu = () => {
  ipcMain.addListener('issuebox-contextmenu', (_ev: Event, issueID: number, issueURL: string) => {
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
      {
        label: 'Open link in the external browser',
        click: (_, __, ___) => {
          openBrowser(issueURL);
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
          openBrowser(url);
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
