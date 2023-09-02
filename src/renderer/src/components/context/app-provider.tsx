import { FunctionComponent, PropsWithChildren, useState } from 'react';
import { outDuplicatesById } from '../../../utils'; // @todo - figure out why test-ubuntu latest can't find 'renderer/utils'
// eslint-disable-next-line import/no-cycle
import { AppContext } from './app-context';

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

const useApp = () => {
  const [folderPath, setFolderPath] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePackage[]>([]);

  const addImages = (moreImages: ImagePackage[]) => {
    setImages((prevImages) => {
      return [...prevImages, ...moreImages].filter(outDuplicatesById);
    });
  };

  const ensureFolderPath = () => {
    if (!folderPath && window.electron) {
      window.electron.ipcRenderer.sendMessage('folder-selection', []);
      setLoading(true);
      window.electron.ipcRenderer.on('folder-selection', (args) => {
        const path = args as string;
        if (path) {
          setFolderPath(path);
        }
      });
      window.electron.ipcRenderer.on('processedImages', (args) => {
        const castedImages = args as ImagePackage[];
        console.log(args);

        if (args) {
          setImages(castedImages ?? []);
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
  };
};

export type UseApp = ReturnType<typeof useApp>;

export const AppProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const value = useApp();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
