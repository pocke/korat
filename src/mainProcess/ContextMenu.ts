import { Menu, MenuItem, BrowserWindow, Event, ipcMain } from 'electron';

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
};
