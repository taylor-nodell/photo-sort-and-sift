import { useEffect } from 'react';
import { ImagePackage } from 'main/types';

import { useApp } from '../context/app-context';
import SelectFolder from '../select-folder/SelectFolder';
import BigPreview from '../big-preview/BigPreview';

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
        <SelectFolder />
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
    </div>
  );
};
export default Layout;
