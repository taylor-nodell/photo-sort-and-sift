import path from 'path';

import { ipcMain, dialog, BrowserWindow } from 'electron';
import { getJPGFileNames } from '../util';
import { generateSharpImages } from '../imageProcessing/generateSharpImages';
import { readSharpImages } from '../imageProcessing/readSharpImages';
import { formatImagesToPackages } from '../imageProcessing/packageImages';
import { GeneratedFileNameEnding } from '../types';

let selectedFolder: string | null = null;

export const setupIpcHandlers = (mainWindow: BrowserWindow) => {
  ipcMain.on('folder-selection', async (event, args) => {
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
      event.reply('folder-selection', selectedFolder);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      sendImagesOnFolder(event, selectedFolder);
    }
  });
};

const sendImagesOnFolder = async (
  event: Electron.IpcMainEvent,
  folder: string
) => {
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

  // Generate Sharp Images
  const sharpImageData = await Promise.all(
    generateSharpImages(allJPGFullFilePaths)
  );
  console.log(
    'sharpImageData ',
    sharpImageData.map((s: any) => {
      return {
        orientation: s.orientation,
      };
    })
  );

  // Read the sharp images that we just generated
  const unpackagedImages = await Promise.all(readSharpImages(sharpImageData));

  // Package these images in a format that will allow us to read back the original jpg and nef paths
  const packagedImages = formatImagesToPackages(unpackagedImages);
  console.log(
    'packaged ',
    Object.keys(packagedImages).map((k) => {
      return {
        k,
        originalPathName: packagedImages[k].jpegPath,
        thumbnail: packagedImages[k].thumbnail ? 'yes' : 'no',
        bigPreview: packagedImages[k].bigPreview ? 'yes' : 'no',
        orientation: packagedImages[k].orientation,
      };
    })
  );

  const allImagePackages = Object.values(packagedImages);

  event.reply('processedImages', allImagePackages);
};

// const sendImagesOnFolder = async (event: Electron.IpcMainEvent, folder: string) => {
//     const allJPGFileNames = await getJPGFileNames(folder);
//     const validFiles = allJPGFileNames.filter(/* Filtering logic */);
//     const sharpImageData = await generateSharpImages(validFiles);
//     const unpackagedImages = await readSharpImages(sharpImageData);
//     const packagedImages = formatImagesToPackages(unpackagedImages);

//     event.reply('processedImages', Object.values(packagedImages));
//   };
