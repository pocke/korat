'use strict';

// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';

import { setMainWindow } from './BrowserWindowHandler';
import { startContextMenu } from './ContextMenu';
import { setMenu } from './Menu';

export const start = async () => {
  startContextMenu();

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let mainWindow: Electron.BrowserWindow | null;

  const APP_URL = `file://${__dirname}/../public/index.html`;

  function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });
    setMainWindow(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadURL(APP_URL);

    // Open the DevTools.
    // TODO: Remove this code when production build
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  const onAppReady = () => new Promise(resolve => app.on('ready', resolve));

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow();
    }
  });

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  await onAppReady();
  setMenu();
  createWindow();
};
