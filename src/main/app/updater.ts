import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export const setupUpdater = () => {
  log.transports.file.level = 'info';
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
};
