/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import sharp from 'sharp';
import { existsSync, readdir, readFile } from 'fs';
import {
  GeneratedFileNameEnding,
  ImagePackage,
  ImageType,
  ReadingSharpData,
  SharpOutput,
} from './types';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const generateSharpThumbnail = async (
  originalFilePath: string,
  newFilePath: string
) => {
  return sharp(originalFilePath)
    .resize(200, 200, { fit: 'contain' })
    .toFile(newFilePath)
    .catch((err) =>
      console.error(
        `Error writing thumbnail ${newFilePath} with sharp: \n ${err}`
      )
    )
    .then((output) => ({
      originalFilePath,
      sharpFilePath: newFilePath,
      type: ImageType.THUMBNAIL,
      ...output,
    }));
};

export const generateSharpBigPreview = async (
  originalFilePath: string,
  newFilePath: string
) => {
  return sharp(originalFilePath)
    .resize(600, 400, { fit: 'contain' })
    .toFile(newFilePath)
    .catch((err) =>
      console.error(
        `Error writing thumbnail ${newFilePath} with sharp: \n ${err}`
      )
    )
    .then((output) => ({
      originalFilePath,
      sharpFilePath: newFilePath,
      type: ImageType.BIG_PREVIEW,
      ...output,
    }));
};

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

export const getJPGFileNames = (folder: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    readdir(folder, (err, files) => {
      if (err) {
        console.error(`error reading folder ${folder}, `, err);
        reject(err);
      }
      const imageFiles = files.filter(
        (file) => file.endsWith('.jpg') || file.endsWith('.JPG')
      );
      resolve(imageFiles);
    });
  });

export const generateSharpImages = (
  allJPGFullFilePaths: string[]
): Promise<SharpOutput>[] => {
  const sharpPromises: Promise<SharpOutput>[] = [];
  allJPGFullFilePaths.forEach((jpgFilePath) => {
    const thumbnailPath = `${jpgFilePath}${GeneratedFileNameEnding.THUMBNAIL}`;
    const bigPreviewPath = `${jpgFilePath}${GeneratedFileNameEnding.BIG_PREVIEW}`;

    // Check if this compressedThumbnailPath already exists, if so, no need to create a new file, assume we've already resized with sharp
    if (!existsSync(thumbnailPath)) {
      sharpPromises.push(generateSharpThumbnail(jpgFilePath, thumbnailPath));
    } else {
      console.log('already exists: ', thumbnailPath);
      const existingImageData = readSharpImageData({
        originalFilePath: jpgFilePath,
        sharpFilePath: thumbnailPath,
        type: ImageType.THUMBNAIL,
      }).then((output) => ({
        originalFilePath: jpgFilePath,
        sharpFilePath: thumbnailPath,
        ...output,
      }));

      sharpPromises.push(existingImageData);
    }

    if (!existsSync(bigPreviewPath)) {
      sharpPromises.push(generateSharpBigPreview(jpgFilePath, bigPreviewPath));
    } else {
      const existingImageData = readSharpImageData({
        originalFilePath: jpgFilePath,
        sharpFilePath: bigPreviewPath,
        type: ImageType.BIG_PREVIEW,
      }).then((output) => ({
        originalFilePath: jpgFilePath,
        sharpFilePath: bigPreviewPath,
        ...output,
      }));
      sharpPromises.push(existingImageData);
    }
  });

  return sharpPromises;
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

// START HERE: package these in a way that combines the thumbnail and the preview image
// or turn these into packages, and combine them somewhere else
export const formatImagesToPackages = (unsortedImages: ReadingSharpData[]) => {
  const imagesPackage: { [index: string]: ImagePackage } = {};
  unsortedImages.forEach((unsortedImage) => {
    const temp: ImagePackage = {
      id: unsortedImage.originalPathName,
      jpegPath: unsortedImage.originalPathName,
      nefPath: undefined, // @todo
      thumbnail: undefined,
      bigPreview: undefined,
    };

    if (unsortedImage.type === ImageType.THUMBNAIL) {
      temp.thumbnail = {
        data: unsortedImage.data,
        pathName: unsortedImage.originalPathName,
      };
    } else if (unsortedImage.type === ImageType.BIG_PREVIEW) {
      temp.bigPreview = {
        data: unsortedImage.data,
        pathName: unsortedImage.originalPathName,
      };
    }

    // Check if this image already exists in the package, if so, add the thumbnail or preview to it
    if (imagesPackage[unsortedImage.originalPathName]) {
      if (unsortedImage.type === ImageType.THUMBNAIL) {
        imagesPackage[unsortedImage.originalPathName].thumbnail = {
          data: unsortedImage.data,
          pathName: unsortedImage.originalPathName,
        };
      } else if (unsortedImage.type === ImageType.BIG_PREVIEW) {
        imagesPackage[unsortedImage.originalPathName].bigPreview = {
          data: unsortedImage.data,
          pathName: unsortedImage.originalPathName,
        };
      }
    } else {
      imagesPackage[unsortedImage.originalPathName] = temp;
    }
  });
  return imagesPackage;
};
