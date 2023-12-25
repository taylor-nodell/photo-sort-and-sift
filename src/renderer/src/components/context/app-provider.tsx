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
  // const [selectedImage, setSelectedImage] = useState<ImagePackage>();
  const [selectedPhotoManagerFacade, setSelectedPhotoManagerFacade] =
    useState<PhotoManagerFacade>();
  const [photoManagerFacades, setPhotoManagerFacades] = useState<
    PhotoManagerFacade[]
  >([]);

  const addImages = (moreImages: ImagePackage[]) => {
    setImages((prevImages) => {
      return [...prevImages, ...moreImages].filter(outDuplicatesById);
    });
  };

  const ensureFolderPath = () => {
    console.log('ensureFolderPath');
    if (!folderPath && window.electron) {
      window.electron.ipcRenderer.sendMessage('folderSelection', []);
      setLoading(true);
      window.electron.ipcRenderer.on('folderSelection', (args) => {
        const path = args as string;
        if (path) {
          setFolderPath(path);
        }
      });
      // once you get the image jpg file paths, you can start loading the images
      window.electron.ipcRenderer.on('gotImagePaths', async (args) => {
        // Set all the images as PhotoManagerFacades
        const imagePaths = args as string[];
        const pmfFacades = imagePaths.map(
          (imagePath) => new PhotoManagerFacade(imagePath)
        );
        setSelectedPhotoManagerFacade(pmfFacades[0]);
        setPhotoManagerFacades(pmfFacades);

        // Get the thumbnails and big previews
        // in own Promise.all so they can be done in parallel
        // const thumbnails = await Promise.all(
        //   photoManagerFacades.map((pmf) => pmf.getThumbnail())
        // );
        // const bigPreviews = await Promise.all(
        //   photoManagerFacades.map((pmf) => pmf.getBigPreview())
        // );
      });

      setLoading(false);
    }
  };

  const changeFolder = () => {
    setLoading(true);
    window.electron.ipcRenderer.sendMessage('folderSelection', [
      'change-folder',
    ]);
  };

  return {
    folderPath,
    setFolderPath,
    addImages,
    ensureFolderPath,
    changeFolder,
    loading,
    selectedPhotoManagerFacade,
    setSelectedPhotoManagerFacade,
    photoManagerFacades,
  };
};

export type UseApp = ReturnType<typeof useApp>;

export const AppProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const value = useApp();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
