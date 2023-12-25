import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { ImageData } from 'main/types';

import { outDuplicatesById } from '../../../utils'; // @todo - figure out why test-ubuntu latest can't find 'renderer/utils'
// eslint-disable-next-line import/no-cycle
import { AppContext } from './app-context';
import { PhotoManagerFacade } from '../../../photoManagerFacade';

export interface ImagePackage {
  id: string;
  jpegPath: string;
  nefPath?: string;
  thumbnail: ImageData;
  bigPreview: ImageData;
}

const useApp = () => {
  const [folderPath, setFolderPath] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePackage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImagePackage>();

  const addImages = (moreImages: ImagePackage[]) => {
    setImages((prevImages) => {
      return [...prevImages, ...moreImages].filter(outDuplicatesById);
    });
  };

  const ensureFolderPath = () => {
    console.log('ensureFolderPath');
    if (!folderPath && window.electron) {
      window.electron.ipcRenderer.sendMessage('folder-selection', []);
      setLoading(true);
      window.electron.ipcRenderer.on('folder-selection', (args) => {
        const path = args as string;
        if (path) {
          setFolderPath(path);
        }
      });

      window.electron.ipcRenderer.on('processedImages', async (args) => {
        const photoManagerData = args as { jpgPath: string }[];

        if (photoManagerData) {
          const photoManagerFacades = photoManagerData.map(
            (data) => new PhotoManagerFacade(data.jpgPath)
          );

          // look at the first image
          console.log('getting photo');
          const thumbnail =
            (await photoManagerFacades[0].getThumbnail()) as ImageData;

          console.log('thumbnail', thumbnail);
          setSelectedImage({
            id: thumbnail.pathName,
            jpegPath: thumbnail.pathName,
            thumbnail,
            bigPreview: thumbnail,
          });
        } else {
          console.log('no photoManagerData');
        }

        setLoading(false);
      });
    }
  };

  const changeFolder = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('folder-selection', [
      'change-folder',
    ]);
  };

  return {
    folderPath,
    setFolderPath,
    images,
    addImages,
    ensureFolderPath,
    changeFolder,
    loading,
    selectedImage,
    setSelectedImage,
  };
};

export type UseApp = ReturnType<typeof useApp>;

export const AppProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const value = useApp();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
