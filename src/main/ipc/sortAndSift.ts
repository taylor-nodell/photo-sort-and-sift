import path from 'path';
import fs from 'fs';
import { SubjectKeeper } from 'renderer/src/components/context/app-provider';

const keepersPath = 'D:\\Photos\\Keepers\\';

export const sortAndSift = (keepers: SubjectKeeper[]) => {
  // For each keeper, move the keeper's imagePackages to the destination folder
  const destinationFolder = determineDestinationFolder(keepers);
  console.log('destinationFolder: ', destinationFolder);
  // If the destination folder doesn't exist, create it
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }
};

const determineDestinationFolder = (keepers: SubjectKeeper[]) => {
  // Create a new folder in keepersPath with the name of the first keepers folder path after Photos\\
  const firstKeeper = keepers[0];
  const firstImagePackage = firstKeeper.imagePackages[0];
  const folderPath = firstImagePackage.jpegPath;
  console.log('folderPath: ', folderPath);
  // D:\Photos\PhotoSortNSiftTest\DSC_0015.JPG
  const folderName = folderPath.split('Photos\\')[1].split('\\')[0];
  const destinationFolder = path.join(keepersPath, folderName);
  return destinationFolder;
};
