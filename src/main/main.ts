/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { getJPGFileNames, resolveHtmlPath } from './util';
import { GeneratedFileNameEnding } from './types';
// import { generateSharpImages } from './generateSharpImages';
// import { formatImagesToPackages } from './packageImages';
// import { readSharpImages } from './readSharpImages';
import { PhotoManager } from './photoManager';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let selectedFolder: string | null = null;

ipcMain.on('ipcExample', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipcExample', msgTemplate('pong'));
});

ipcMain.on('getThumbnail', async (event, args: string[]) => {
  // @todo = cache the creating new PhotoManager instances?
  const jpgPath = args[0];
  const photoManager = new PhotoManager(jpgPath);
  const thumbnail = await photoManager.getThumbnail();
  console.log('Got the thumbnail from photoManager', thumbnail);
  event.reply('returnThumbnail', thumbnail);
});

ipcMain.on('getBigPreview', async (event, args: string[]) => {
  // @todo = cache the creating new PhotoManager instances?
  const jpgPath = args[0];
  const photoManager = new PhotoManager(jpgPath);
  const bigPreview = await photoManager.getBigPreview();
  event.reply('returnBigPreview', bigPreview);
});

const sendJpgPaths = async (event: Electron.IpcMainEvent, folder: string) => {
  // Get the paths in the folder
  const allJPGFileNames = await getJPGFileNames(folder);
  const allJPGFullFilePaths = allJPGFileNames
    .filter(
      // Filter out any file path names that look like we already generated them with sharp, @todo - is there a better way?
      (jpgFilePathName) =>
        !jpgFilePathName.endsWith(GeneratedFileNameEnding.THUMBNAIL) &&
        !jpgFilePathName.endsWith(GeneratedFileNameEnding.BIG_PREVIEW)
    )
    .map((jpgFileName) => path.resolve(folder, jpgFileName));
  console.log('allJPGFullFilePaths: \n', allJPGFullFilePaths);

  // Send the PhotoManagers over IPC
  event.reply('gotImagePaths', allJPGFullFilePaths);
};

ipcMain.on('folderSelection', async (event, args) => {
  // @todo - Choosing a folder always says "No files match your search" in the windows file browser, can this be less confusing?
  // We could show the files but we are trying to choose a folder, not a file
  if (!mainWindow) {
    console.error('folderSelection: no main window');
    return;
  }
  const changeFolder = args?.[0] === 'change-folder';
  if (!selectedFolder || changeFolder) {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });
    if (result.filePaths?.length) {
      [selectedFolder] = result.filePaths;
    }
  }
  if (selectedFolder) {
    event.reply('folderSelection', selectedFolder);
    // instead of sending the images on folder over, just send the paths of the jpgs as ids
    sendJpgPaths(event, selectedFolder);
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
