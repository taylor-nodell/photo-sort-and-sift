import sharp from 'sharp';

export interface ImageData {
  pathName: string; // path to the sharp generated image
  data: string; // Base64
}

export interface ImagePackage {
  id: string;
  jpegPath: string;
  nefPath?: string;
  thumbnail: ImageData;
  bigPreview: ImageData;
}

export type SharpOutput = {
  originalFilePath: string;
  sharpFilePath: string;
  type: ImageType;
  output: sharp.OutputInfo;
};

export type ExistingImage = {
  sharpFilePath: string;
  originalFilePath: string;
  type: ImageType;
};

export type ReadingSharpData = {
  sharpPathName: string;
  originalPathName: string;
  type: ImageType;
  data: string;
};

export enum ImageType {
  THUMBNAIL = 'THUMBNAIL',
  BIG_PREVIEW = 'BIG_PREVIEW',
}

export enum GeneratedFileNameEnding {
  THUMBNAIL = '_thumbnail.jpg',
  BIG_PREVIEW = '_bigPreview.jpg',
}
