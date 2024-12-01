import { useEffect } from 'react';
import { ImagePackage } from 'main/types';

import { useApp } from '../context/app-context';
import BigPreview from '../big-preview/BigPreview';
import { CreateSubjectKeeperModal } from '../CreateSubjectKeeperModal/CreateSubjectKeeperModal';

import './Layout.css';
import useKeyHandlers from './useKeyHandlers';
import { ExtendedImagePackage } from '../context/app-provider';

const Layout = () => {
  const {
    images,
    ensureFolderPath,
    folderPath,
    loading,
    setSelectedImage,
    selectedImage,
    isCreatingSubjectKeeper,
  } = useApp();

  useEffect(() => {
    ensureFolderPath();
  }, []);

  useKeyHandlers();

  const handleImageClick = (imagePackage: ExtendedImagePackage) => {
    setSelectedImage(imagePackage);
  };

  return (
    <div className="main">
      <div className="top">
        <BigPreview />
      </div>
      <div className="bottom">
        <div>Path: {folderPath}</div>
        {loading && 'Loading...'}
        {!loading && images.length === 0 && 'No jpg images'}
        {images
          .filter((image) => image.thumbnail)
          .map((image) => (
            <button
              key={image.thumbnail.pathName}
              onClick={() => handleImageClick(image)}
              className={`btn ${
                selectedImage?.id === image.id ? 'selected' : ''
              }`}
              type="button"
            >
              <img
                width={200}
                height={200}
                src={`data:image/jpeg;charset=utf-8;base64,${image.thumbnail.data}`}
                alt={image.thumbnail.pathName}
              />
            </button>
          ))}
      </div>
      {isCreatingSubjectKeeper && <CreateSubjectKeeperModal />}
    </div>
  );
};
export default Layout;
