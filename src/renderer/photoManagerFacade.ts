export class PhotoManagerFacade {
  jpgPath: string;

  constructor(jpgPath: string) {
    this.jpgPath = jpgPath;
  }

  async getThumbnail() {
    console.log('getThumbnail', this.jpgPath);
    // @todo can i cache this if I already have it?
    return new Promise((resolve, reject) => {
      window.electron.ipcRenderer.sendMessage('getThumbnail', [this.jpgPath]);
      window.electron.ipcRenderer.once('returnThumbnail', (thumbnail) => {
        console.log('returnThumbnail', thumbnail);
        if (thumbnail) {
          resolve(thumbnail);
        } else {
          reject(new Error('Failed to generate thumbnail'));
        }
      });
    });
  }
}
