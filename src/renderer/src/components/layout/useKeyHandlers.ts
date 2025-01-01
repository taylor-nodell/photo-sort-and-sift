import { useEffect } from 'react';
import { useApp } from '../context/app-context';
import { SubjectKeeper } from '../context/app-provider';

const useKeyHandlers = () => {
  const {
    images,
    setSelectedImage,
    setImages,
    selectedImage,
    isCreatingSubjectKeeper,
    setIsCreatingSubjectKeeper,
    subjectKeepers,
    setSubjectKeepers,
    currentSubjectKeeperId,
    setCurrentSubjectKeeperId,
  } = useApp();

  const handleSpaceBarPress = () => {
    // START HERE: Handle ending this subject keeper and creating a new one
    // 1. Keep UI from extending when adding subject keepers
    // 2. Prevent pressing n to create a new keeper on top the same current keeper

    // No current keeper: Prompt a dialog to enter a new SubjectKeeper name and create a SubjectKeeper
    if (!isCreatingSubjectKeeper && !currentSubjectKeeperId) {
      setIsCreatingSubjectKeeper(true);
    } else {
      // Add the current image to the SubjectKeeper's array of imagePackages
      setSubjectKeepers((prevKeepers: SubjectKeeper[]) => {
        // Check if the image is already added to the current SubjectKeeper
        const isAlreadyAdded = prevKeepers
          .find((keeper) => keeper.id === currentSubjectKeeperId)
          ?.imagePackages.find((image) => image.id === selectedImage?.id);

        // If there is a current SubjectKeeper, a selected image, and the image is not already added to the current SubjectKeeper
        if (currentSubjectKeeperId && selectedImage && !isAlreadyAdded) {
          return prevKeepers.map((keeper) => {
            if (keeper.id === currentSubjectKeeperId) {
              return {
                ...keeper,
                imagePackages: [...keeper.imagePackages, selectedImage],
              };
            }
            return keeper;
          });
        }
        return prevKeepers;
      });

      // Until user presses N key to create a new SubjectKeeper
    }
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
        case 'n':
          setIsCreatingSubjectKeeper(true);
          break;
        case 'x':
          setIsCreatingSubjectKeeper(true);
          break;
        case 'Escape':
          setCurrentSubjectKeeperId('');
          setIsCreatingSubjectKeeper(false);
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
