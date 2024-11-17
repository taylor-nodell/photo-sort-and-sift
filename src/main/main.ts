import { app, BrowserWindow } from 'electron';
import { createMainWindow } from './app/createWindow';
import { setupAppEvents } from './app/appEvents';
import { setupUpdater } from './app/updater';
import { setupIpcHandlers } from './ipc/ipcHandlers';

let mainWindow: BrowserWindow | null = null;

// eslint-disable-next-line promise/catch-or-return
app.whenReady().then(() => {
  mainWindow = createMainWindow();
  setupAppEvents(() => createMainWindow());
  setupUpdater();
  // eslint-disable-next-line promise/always-return
  if (mainWindow) setupIpcHandlers(mainWindow);
});
