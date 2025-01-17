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
    isShowingReviewScreen,
    setIsShowingReviewScreen,
  } = useApp();

  const isImageAlreadyAdded = () => {
    const imagesAlreadyAddedMap = new Map<string, boolean>();
    subjectKeepers.forEach((keeper) => {
      keeper.imagePackages.forEach((image) => {
        imagesAlreadyAddedMap.set(image.id, true);
      });
    });
    const result = imagesAlreadyAddedMap.get(selectedImage?.id ?? '');
    return !!result;
  };

  const handleSpaceBarPress = () => {
    if (isCreatingSubjectKeeper) return;

    if (
      !isCreatingSubjectKeeper &&
      !currentSubjectKeeperId &&
      !isImageAlreadyAdded()
    ) {
      // No current keeper: Prompt a dialog to enter a new SubjectKeeper name and create a SubjectKeeper
      setIsCreatingSubjectKeeper(true);
    } else {
      // Add the current image to the SubjectKeeper's array of imagePackages
      setSubjectKeepers((prevKeepers: SubjectKeeper[]) => {
        // If there is a current SubjectKeeper, a selected image, and the image is not already added to the current SubjectKeeper
        if (currentSubjectKeeperId && selectedImage && !isImageAlreadyAdded()) {
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
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
          if (!isCreatingSubjectKeeper && !isImageAlreadyAdded()) {
            setIsCreatingSubjectKeeper(true);
          }
          break;
        case 'Escape':
          if (isCreatingSubjectKeeper) {
            setIsCreatingSubjectKeeper(false);
            break;
          }
          setCurrentSubjectKeeperId(undefined);
          if (isShowingReviewScreen) {
            setIsShowingReviewScreen(false);
          }
          break;
        case 'Enter':
          console.log(subjectKeepers);
          if (e.shiftKey) {
            setIsShowingReviewScreen(true);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    selectedImage,
    images,
    isCreatingSubjectKeeper,
    subjectKeepers,
    currentSubjectKeeperId,
  ]);
};

export default useKeyHandlers;
