import path from 'path';
import fs from 'fs';
import { SubjectKeeper } from 'renderer/src/components/context/app-provider';

const keepersPath = 'D:\\Photos\\Keepers\\';

export const determineDestinationFolder = (keepers: SubjectKeeper[]) => {
  // Create a new folder in keepersPath with the name of the first keepers folder path after Photos\\
  const firstKeeper = keepers[0];
  const firstImagePackage = firstKeeper.imagePackages[0];
  const folderPath = firstImagePackage.jpegPath;
  const folderName = folderPath.split('Photos\\')[1].split('\\')[0];
  const destinationFolder = path.join(keepersPath, folderName);
  return destinationFolder;
};

export const deleteBigPreviewAndThumbnailFiles = (originalFolder: string) => {
  const bigPreviewFiles = fs
    .readdirSync(originalFolder)
    .filter((file) => file.includes('bigPreview'));

  bigPreviewFiles.forEach((bigPreviewFile) => {
    const bigPreviewFilePath = path.join(originalFolder, bigPreviewFile);
    fs.unlinkSync(bigPreviewFilePath);
  });

  const thumbnailFiles = fs
    .readdirSync(originalFolder)
    .filter((file) => file.includes('thumbnail'));

  thumbnailFiles.forEach((thumbnailFile) => {
    const thumbnailFilePath = path.join(originalFolder, thumbnailFile);
    fs.unlinkSync(thumbnailFilePath);
  });
};

export const createDescriptionsFile = (keepers: SubjectKeeper[]) => {
  const destinationFolder = determineDestinationFolder(keepers);
  const csvFileName = path.join(destinationFolder, 'descriptions.csv');
  const csvStream = fs.createWriteStream(csvFileName);

  // Write the headers row
  csvStream.write('Photo Numbers,Subject,iNat URL\n');

  keepers.forEach((keeper) => {
    const photoNumbers = keeper.imagePackages
      .map((imagePackage) => {
        const jpegFileName = path.basename(imagePackage.jpegPath);
        // remove the file extension, the DSC_ prefix, and preceding zeros
        const photoNumber = jpegFileName
          .split('.')[0]
          .split('DSC_')[1]
          .replace(/^0+/, '');
        return photoNumber;
      })
      .join('; '); // Join photo numbers with a semicolon

    const subject = keeper.name;
    const iNatURL = keeper.iNatUrl || '';

    // Enclose each field in double quotes and separate with commas
    csvStream.write(`"${photoNumbers};","${subject}","${iNatURL}"\n`);
  });

  csvStream.end();
};
