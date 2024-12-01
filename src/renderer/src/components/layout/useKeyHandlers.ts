import { useEffect } from 'react';
import { useApp } from '../context/app-context';

const useKeyHandlers = () => {
  const { images, setSelectedImage, setImages, selectedImage } = useApp();

  const handleSpaceBarPress = () => {
    // 1st time prompt a dialog to enter a new SubjectKeeper name and create a SubjectKeeper
    // Add the current image to the SubjectKeeper's imagePackages
    // Subsequent times add the current image to the SubjectKeeper's imagePackages
    // Until user presses N key to create a new SubjectKeeper
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // e.preventDefault();

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
        case 'Delete':
          setImages((prevImages) => {
            return prevImages.map((image) => {
              if (image.id === selectedImage?.id) {
                return {
                  ...image,
                  markedForDeletion: true,
                  isKeeper: false,
                };
              }
              return image;
            });
          });
          break;
        case ' ':
          setImages((prevImages) => {
            return prevImages.map((image) => {
              if (image.id === selectedImage?.id) {
                return {
                  ...image,
                  isKeeper: true,
                  markedForDeletion: false,
                };
              }
              return image;
            });
          });
          break;
        case 'Enter':
          //console.log(images.filter((i) => i.isKeeper));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedImage, images]);
};

export default useKeyHandlers;
