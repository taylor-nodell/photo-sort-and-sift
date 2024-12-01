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
  orientation: number;
}

export interface ExtendedImagePackage extends ImagePackage {
  //isKeeper: boolean;
}

export interface SubjectKeeper {
  id: string;
  name: string;
  imagePackages: ImagePackage[];
  iNatUrl?: string;
}

const useApp = () => {
  const [folderPath, setFolderPath] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ExtendedImagePackage[]>([]);
  const [selectedImage, setSelectedImage] = useState<ExtendedImagePackage>();
  const [subjectKeepers, setSubjectKeepers] = useState<SubjectKeeper[]>([]);
  const [currentSubjectKeeper, setCurrentSubjectKeeper] =
    useState<SubjectKeeper>();
  const [isCreatingSubjectKeeper, setIsCreatingSubjectKeeper] = useState(true);

  const addImages = (moreImages: ImagePackage[]) => {
    const extendedImages = moreImages.map((image) => ({
      ...image,
      isKeeper: false,
    }));

    setImages((prevImages) =>
      [...prevImages, ...extendedImages].filter(outDuplicatesById)
    );
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
        const castedImages = (args as ImagePackage[]).map((image) => ({
          ...image,
          isKeeper: false,
        }));

        if (args) {
          setImages(castedImages ?? []);
          setSelectedImage(castedImages[0]);
        }
        setLoading(false);
      });
    }
  };

  const handleSpaceBarPress = () => {
    // 1st time prompt a dialog to enter a new SubjectKeeper name and create a SubjectKeeper
    // Add the current image to the SubjectKeeper's imagePackages
    // Subsequent times add the current image to the SubjectKeeper's imagePackages
    // Until user presses N key to create a new SubjectKeeper
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
    setImages,
    isCreatingSubjectKeeper,
    setIsCreatingSubjectKeeper,
    subjectKeepers,
    setSubjectKeepers,
    currentSubjectKeeper,
    setCurrentSubjectKeeper,
  };
};

export type UseApp = ReturnType<typeof useApp>;

export const AppProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const value = useApp();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
