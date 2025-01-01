import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import MenuBuilder from '../menu/menuBuilder';
import { resolveHtmlPath } from '../util';

export const createMainWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 1100,
    icon: resolveHtmlPath('icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow.destroy();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  return mainWindow;
};
