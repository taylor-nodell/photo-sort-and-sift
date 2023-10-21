import { useEffect } from 'react';
import { ImagePackage } from 'main/types';

import { useApp } from '../context/app-context';
import SelectFolder from '../select-folder/SelectFolder';
import './Layout.css';
import BigPreview from '../big-preview/BigPreview';

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();

      const index = images.findIndex((image) => image.id === selectedImage?.id);

      if (index === -1) return;
      switch (e.key) {
        case 'ArrowLeft':
          if (index === 0) return;
          setSelectedImage(images[index - 1]);
          break;
        case 'ArrowRight':
          if (index === images.length - 1) return;
          setSelectedImage(images[index + 1]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedImage, images]);

  const handleImageClick = (imagePackage: ImagePackage) => {
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
