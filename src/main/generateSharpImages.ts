import sharp, { Metadata } from 'sharp';
import { existsSync, readFile } from 'fs';
import {
  SharpOutput,
  GeneratedFileNameEnding,
  ImageType,
  ExistingImage,
} from './types';
import { validateExistingImage } from './util';

export const generateSharpThumbnail = async (
  originalFilePath: string,
  newFilePath: string
): Promise<SharpOutput> => {
  // Get metadata to determine the image orientation
  const metadata = await sharp(originalFilePath).metadata();
  // Use the orientation property from the metadata
  const { orientation } = metadata;

  return sharp(originalFilePath)
    .resize(200, 200, { fit: 'contain' })
    .withMetadata()
    .toFile(newFilePath)
    .then((output) => {
      return {
        originalFilePath,
        sharpFilePath: newFilePath,
        type: ImageType.THUMBNAIL,
        orientation,
        output,
      };
    })
    .catch((err) => {
      console.error(
        `Error writing thumbnail ${newFilePath} with sharp: \n ${err}`
      );
      throw err;
    });
};

export const generateSharpBigPreview = async (
  originalFilePath: string,
  newFilePath: string
): Promise<SharpOutput> => {
  // Get metadata to determine the image orientation
  const metadata = await sharp(originalFilePath).metadata();
  const { orientation } = metadata;

  return sharp(originalFilePath)
    .resize(600, 400, { fit: 'contain' })
    .withMetadata()
    .toFile(newFilePath)
    .then((output) => {
      return {
        originalFilePath,
        sharpFilePath: newFilePath,
        type: ImageType.BIG_PREVIEW,
        orientation,
        output,
      };
    })
    .catch((err) => {
      console.error(
        `Error writing big preview ${newFilePath} with sharp: \n ${err}`
      );
      throw err;
    });
};

export const readExistingImageData = async (
  existingImage: ExistingImage
): Promise<SharpOutput> => {
  return new Promise((resolve, reject) => {
    readFile(
      existingImage.sharpFilePath,
      { encoding: 'base64' },
      async (error, data) => {
        await validateExistingImage(existingImage, error, data, reject);
        // Read the metadata from the existing image
        const metadata: Metadata = await sharp(
          existingImage.sharpFilePath
        ).metadata();

        console.log('Existing photo metadata: ', metadata);

        // If any of the metadata is undefined, reject
        if (
          !metadata ||
          !metadata.format ||
          //   !metadata.size || // size does not exist when reading metadata
          !metadata.width ||
          !metadata.height ||
          !metadata.channels
        ) {
          throw new Error(
            `Error reading metadata from ${existingImage.sharpFilePath}`
          );
        }
        resolve({
          sharpFilePath: existingImage.sharpFilePath,
          originalFilePath: existingImage.originalFilePath,
          type: existingImage.type,
          orientation: metadata.orientation,
          output: {
            format: metadata.format,
            size: metadata.size || 0,
            width: metadata.width,
            height: metadata.height,
            channels: metadata.channels,
            premultiplied: false,
          },
        });
      }
    );
  });
};
export const generateSharpImages = (
  allJPGFullFilePaths: string[]
): Promise<SharpOutput>[] => {
  const sharpPromises: Promise<SharpOutput>[] = [];
  // Look at each of the JPG files in the folder,
  // if there is no thumbnail or preview already generated, generate them
  allJPGFullFilePaths.forEach((jpgFilePath) => {
    const thumbnailPath = `${jpgFilePath}${GeneratedFileNameEnding.THUMBNAIL}`;
    const bigPreviewPath = `${jpgFilePath}${GeneratedFileNameEnding.BIG_PREVIEW}`;

    // Check if this compressedThumbnailPath already exists, if so, no need to create a new file, assume we've already resized with sharp
    if (!existsSync(thumbnailPath)) {
      sharpPromises.push(generateSharpThumbnail(jpgFilePath, thumbnailPath));
    } else {
      // If the thumbnail already exists, read the data from the file
      const existingImageData = readExistingImageData({
        originalFilePath: jpgFilePath,
        sharpFilePath: thumbnailPath,
        type: ImageType.THUMBNAIL,
      });

      sharpPromises.push(existingImageData);
    }

    if (!existsSync(bigPreviewPath)) {
      sharpPromises.push(generateSharpBigPreview(jpgFilePath, bigPreviewPath));
    } else {
      const existingImageData = readExistingImageData({
        originalFilePath: jpgFilePath,
        sharpFilePath: bigPreviewPath,
        type: ImageType.BIG_PREVIEW,
      });
      sharpPromises.push(existingImageData);
    }
  });

  return sharpPromises;
};
