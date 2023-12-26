import { ImageData } from 'main/types';

export class PhotoManagerFacade {
  jpgPath: string;

  constructor(jpgPath: string) {
    this.jpgPath = jpgPath;
  }

  async getThumbnail(): Promise<ImageData> {
    return window.electron.ipcRenderer
      .invoke('getThumbnail', this.jpgPath)
      .then((thumbnail) => {
        if (thumbnail) {
          return thumbnail as ImageData;
        }
        throw new Error('Failed to generate thumbnail');
      });
  }

  async getBigPreview(): Promise<ImageData> {
    return window.electron.ipcRenderer
      .invoke('getBigPreview', this.jpgPath)
      .then((bigPreview) => {
        if (bigPreview) {
          return bigPreview as ImageData;
        }
        throw new Error('Failed to generate bigPreview');
      });
  }
}
