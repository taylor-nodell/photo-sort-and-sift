import { app, BrowserWindow } from 'electron';

export const setupAppEvents = (createWindow: () => void) => {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('ready', createWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
};

// app.on('window-all-closed', () => {
//     // Respect the OSX convention of having the application in memory even
//     // after all windows have been closed
//     if (process.platform !== 'darwin') {
//       app.quit();
//     }
//   });

//   app
//     .whenReady()
//     .then(() => {
//       createWindow();

//       app.on('activate', () => {
//         // On macOS it's common to re-create a window in the app when the
//         // dock icon is clicked and there are no other windows open.
//         if (mainWindow === null) createWindow();
//       });
//     })
//     .catch(console.log);
