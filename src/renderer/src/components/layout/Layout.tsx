import { useEffect } from 'react';
import { ImagePackage } from 'main/types';

import { useApp } from '../context/app-context';
import BigPreview from '../big-preview/BigPreview';
import { CreateSubjectKeeperModal } from '../CreateSubjectKeeperModal/CreateSubjectKeeperModal';

import './Layout.css';
import useKeyHandlers from './useKeyHandlers';
import { CurrentSubjectKeeper } from '../CurrentSubjectKeeper/CurrentSubjectKeeper';
import { KeeperLog } from '../KeeperLog/KeeperLog';

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

  const handleImageClick = (imagePackage: ImagePackage) => {
    setSelectedImage(imagePackage);
  };

  return (
    <div className="main">
      <div className="top">
        <CurrentSubjectKeeper />
        <BigPreview />
        <KeeperLog />
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
              className="btn"
              type="button"
            >
              <img
                width={200}
                height={200}
                className={selectedImage?.id === image.id ? 'selected' : ''}
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
