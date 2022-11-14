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
