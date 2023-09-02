// START HERE: package these in a way that combines the thumbnail and the preview image

import { ReadingSharpData, ImagePackage, ImageType } from './types';

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
