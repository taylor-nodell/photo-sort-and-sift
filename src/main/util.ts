/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { readdir } from 'fs';
import { ExistingImage } from './types';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

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

export const validateExistingImage = async (
  existingImage: ExistingImage,
  error: null | NodeJS.ErrnoException,
  data: string,
  reject: (reason?: any) => void
) => {
  if (error) {
    console.error(
      `Error reading image ${existingImage.sharpFilePath}: `,
      error
    );
    reject(error);
  }
  if (!data) {
    throw new Error(
      `Error reading image ${existingImage.sharpFilePath}: data is undefined`
    );
  }
};
