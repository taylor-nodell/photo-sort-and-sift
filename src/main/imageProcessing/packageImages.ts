import { ReadingSharpData, ImagePackage, ImageType } from '../types';

export const formatImagesToPackages = (unsortedImages: ReadingSharpData[]) => {
  // Map containing all the images in the package
  const imagesPackage: { [index: string]: Partial<ImagePackage> } = {};

  // Loop through all the images, package them, and add them to the map
  unsortedImages.forEach((unsortedImage) => {
    // Check if this image already exists in the package,
    if (imagesPackage[unsortedImage.originalPathName]) {
      // if the image already exists in the package, add the thumbnail or bigPreview to the package
      const temp = imagesPackage[unsortedImage.originalPathName];
      if (unsortedImage.type === ImageType.THUMBNAIL) {
        temp.thumbnail = {
          data: unsortedImage.data,
          pathName: unsortedImage.originalPathName,
        };
      }
      if (unsortedImage.type === ImageType.BIG_PREVIEW) {
        temp.bigPreview = {
          data: unsortedImage.data,
          pathName: unsortedImage.originalPathName,
        };
      }
    } else {
      console.log('unsortedImage.orientation', unsortedImage.orientation);
      // The image does not exist in the package, create a new package
      const temp: Partial<ImagePackage> = {
        id: unsortedImage.originalPathName,
        jpegPath: unsortedImage.originalPathName,
        nefPath: undefined, // @todo
        thumbnail:
          unsortedImage.type === ImageType.THUMBNAIL
            ? {
                data: unsortedImage.data,
                pathName: unsortedImage.originalPathName,
              }
            : undefined,
        bigPreview:
          unsortedImage.type === ImageType.BIG_PREVIEW
            ? {
                data: unsortedImage.data,
                pathName: unsortedImage.originalPathName,
              }
            : undefined,
        orientation: unsortedImage.orientation,
      };

      imagesPackage[unsortedImage.originalPathName] = temp;
    }
  });
  return imagesPackage;
};
