/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import sharp from 'sharp';
import { readdir, readFile } from 'fs';
import { ImageData } from './types';

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
  await sharp(originalFilePath)
    .resize(200, 200, { fit: 'contain' })
    .toFile(newFilePath)
    .catch((err) =>
      console.error(
        `Error writing thumbnail ${newFilePath} with sharp: \n ${err}`
      )
    );
};

export const generateSharpBigPreview = async (
  originalFilePath: string,
  newFilePath: string
) => {
  await sharp(originalFilePath)
    .resize(200, 200, { fit: 'contain' })
    .toFile(newFilePath)
    .catch((err) =>
      console.error(
        `Error writing thumbnail ${newFilePath} with sharp: \n ${err}`
      )
    );
};

export const readSharpImageData = async (pathName: string) => {
  const x: ImageData = await new Promise((resolve, reject) => {
    readFile(pathName, { encoding: 'base64' }, (error, data) => {
      if (error) {
        console.error(`error reading image ${pathName}, `, error);
        reject(error);
      }
      resolve({
        pathName,
        data,
      });
    });
  });
  return x;
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
