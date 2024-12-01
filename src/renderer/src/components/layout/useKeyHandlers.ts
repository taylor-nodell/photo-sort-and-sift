import { useEffect } from 'react';
import { useApp } from '../context/app-context';

const useKeyHandlers = () => {
  const {
    images,
    setSelectedImage,
    setImages,
    selectedImage,
    isCreatingSubjectKeeper,
    setIsCreatingSubjectKeeper,
    setCurrentSubjectKeeper,
    subjectKeepers,
    currentSubjectKeeper,
  } = useApp();

  const handleSpaceBarPress = () => {
    console.log('Space bar pressed');
    // 1st time prompt a dialog to enter a new SubjectKeeper name and create a SubjectKeeper
    if (!isCreatingSubjectKeeper && currentSubjectKeeper === null) {
      console.log(
        'Prompt a dialog to enter a new SubjectKeeper name and create a SubjectKeeper'
      );
      setIsCreatingSubjectKeeper(true);
    }
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
          handleSpaceBarPress();
          break;
        case 'Enter':
          console.log(subjectKeepers);
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
