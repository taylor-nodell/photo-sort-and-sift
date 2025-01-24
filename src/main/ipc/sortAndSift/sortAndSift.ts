import path from 'path';
import fs from 'fs';
import { SubjectKeeper } from 'renderer/src/components/context/app-provider';
import { createDescriptionsFile, determineDestinationFolder } from './utils';

export const sortAndSift = (keepers: SubjectKeeper[]) => {
  // For each keeper, move the keeper's imagePackages to the destination folder
  const destinationFolder = determineDestinationFolder(keepers);
  console.log('destinationFolder: ', destinationFolder);
  // If the destination folder doesn't exist, create it
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  // @todo - send a message to the renderer to update the UI with the status of the sort and sift process
  // Copy the jpeg files and NEF files to the destination folder
  keepers.forEach((keeper) => {
    keeper.imagePackages.forEach((imagePackage) => {
      const jpegFileName = path.basename(imagePackage.jpegPath);
      const jpegDestinationPath = path.join(destinationFolder, jpegFileName);
      // @todo - make these async and run in parallel
      fs.copyFileSync(imagePackage.jpegPath, jpegDestinationPath);
      if (imagePackage.nefPath) {
        const nefFileName = path.basename(imagePackage.nefPath);
        const nefDestinationPath = path.join(destinationFolder, nefFileName);
        fs.copyFileSync(imagePackage.nefPath, nefDestinationPath);
      }
      // Delete the moved files from the original folder - imagePackage.jpegPath
      fs.unlinkSync(imagePackage.jpegPath);

      // nefs are deleted in a batch below
      //   if (imagePackage.nefPath) {
      //     fs.unlinkSync(imagePackage.nefPath);
      //   }
    });
  });

  // @todo: find a better way to do this. Probably by doing the grabbing of files from the SD card earlier in the process
  // originalFolder is the path before the last \\ in the first keeper's jpegPath
  //   D:\\Photos\\PhotoSortNSiftTest\\DSC_0376.JPG
  const originalFolder = keepers[0].imagePackages[0].jpegPath
    .split('\\')
    .slice(0, -1)
    .join('\\');

  console.log('originalFolder: ', originalFolder);
  // Delete all the nef files in the original folder
  const nefFiles = fs
    .readdirSync(originalFolder)
    .filter((file) => file.endsWith('.NEF'));

  // @todo - make these async and run in parallel
  nefFiles.forEach((nefFile) => {
    const nefFilePath = path.join(originalFolder, nefFile);
    fs.unlinkSync(nefFilePath);
  });

  // delete all bigPreview and thumbnail files in the original folder
  // deleteBigPreviewAndThumbnailFiles(originalFolder);

  createDescriptionsFile(keepers);
};
