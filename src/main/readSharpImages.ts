import { readFile } from 'fs';
import { SharpOutput, ReadingSharpData } from './types';

export const readSharpImageData = async (
  sharpOutput: SharpOutput
): Promise<ReadingSharpData> => {
  return new Promise((resolve, reject) => {
    readFile(
      sharpOutput.sharpFilePath,
      { encoding: 'base64' },
      (error, data) => {
        if (error) {
          console.error(
            `error reading image ${sharpOutput.sharpFilePath}, `,
            error
          );
          reject(error);
        }
        resolve({
          sharpPathName: sharpOutput.sharpFilePath,
          originalPathName: sharpOutput.originalFilePath,
          type: sharpOutput.type,
          data,
        });
      }
    );
  });
};

export const readSharpImages = (
  sharpImageData: SharpOutput[]
): Promise<ReadingSharpData>[] => {
  const readingSharpImagesPromises: Promise<ReadingSharpData>[] = [];
  sharpImageData.forEach((sharpOutput) => {
    readingSharpImagesPromises.push(readSharpImageData(sharpOutput));
  });

  return readingSharpImagesPromises;
};
