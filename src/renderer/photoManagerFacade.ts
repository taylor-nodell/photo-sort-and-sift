import { ImageData } from 'main/types';

export class PhotoManagerFacade {
  jpgPath: string;

  constructor(jpgPath: string) {
    this.jpgPath = jpgPath;
  }

  async getThumbnail(): Promise<ImageData> {
    console.log('getThumbnail', this.jpgPath);
    // @todo can i cache this if I already have it?
    return new Promise((resolve, reject) => {
      window.electron.ipcRenderer.sendMessage('getThumbnail', [this.jpgPath]);
      window.electron.ipcRenderer.once('returnThumbnail', (args: unknown) => {
        console.log('returnThumbnailARGS', args);
        // @todo - this typing is  weird, can I type the ipcRenderer.once call to be more specific?
        const thumbnail = args as ImageData;
        console.log('returnThumbnail', `${thumbnail.pathName}`, thumbnail);
        if (thumbnail) {
          resolve(thumbnail);
        } else {
          reject(new Error('Failed to generate thumbnail'));
        }
      });
    });
  }

  async getBigPreview() {
    // @todo - this is a copy of getThumbnail, refactor to share code
    console.log('getBigPreview', this.jpgPath);
    // @todo can i cache this if I already have it?
    return new Promise((resolve, reject) => {
      window.electron.ipcRenderer.sendMessage('getBigPreview', [this.jpgPath]);
      window.electron.ipcRenderer.once('returnBigPreview', (bigPreview) => {
        console.log('returnBigPreview', bigPreview);
        if (bigPreview) {
          resolve(bigPreview);
        } else {
          reject(new Error('Failed to generate bigPreview'));
        }
      });
    });
  }
}
