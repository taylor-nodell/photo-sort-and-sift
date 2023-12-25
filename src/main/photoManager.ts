import { existsSync, readFileSync } from 'fs';
import {
  GeneratedFileNameEnding,
  ImageData,
  ImageType,
  SharpOutput,
} from './types';
import { generateSharpThumbnail, readExistingImageData } from './sharpUtils';

export class PhotoManager {
  jpgPath: string;

  nefPath: string;

  constructor(jpgPath: string) {
    this.jpgPath = jpgPath;
    // replace .jpg or .JPG with .NEF
    this.nefPath = jpgPath.replace(/\.jpg$/i, '.NEF');
  }

  async getThumbnail(): Promise<ImageData> {
    // Check if the thumbnail file already exists
    const thumbnailPath = `${this.jpgPath}${GeneratedFileNameEnding.THUMBNAIL}`;

    let sharpOutput: SharpOutput;
    if (existsSync(thumbnailPath)) {
      // If the thumbnail already exists, read the data from the file
      sharpOutput = await readExistingImageData({
        originalFilePath: this.jpgPath,
        sharpFilePath: thumbnailPath,
        type: ImageType.THUMBNAIL,
      });
    } else {
      // Generate thumbnail
      sharpOutput = await generateSharpThumbnail(this.jpgPath, thumbnailPath);
    }
    const base64Data = readFileSync(sharpOutput.sharpFilePath, {
      encoding: 'base64',
    });

    return {
      pathName: sharpOutput.sharpFilePath,
      sharpOutput: sharpOutput.output,
      data: base64Data,
    };
  }

  async getBigPreview(): Promise<ImageData> {
    // @todo - this is a copy of getThumbnail, refactor to share code
    // Check if the big preview file already exists
    const bigPreviewPath = `${this.jpgPath}${GeneratedFileNameEnding.BIG_PREVIEW}`;

    let sharpOutput: SharpOutput;
    if (existsSync(bigPreviewPath)) {
      // If the thumbnail already exists, read the data from the file
      sharpOutput = await readExistingImageData({
        originalFilePath: this.jpgPath,
        sharpFilePath: bigPreviewPath,
        type: ImageType.THUMBNAIL,
      });
    } else {
      // Generate thumbnail
      sharpOutput = await generateSharpThumbnail(this.jpgPath, bigPreviewPath);
    }
    const base64Data = readFileSync(sharpOutput.sharpFilePath, {
      encoding: 'base64',
    });

    return {
      pathName: sharpOutput.sharpFilePath,
      sharpOutput: sharpOutput.output,
      data: base64Data,
    };
  }
}
