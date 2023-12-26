import { useEffect } from 'react';
import { useApp } from '../context/app-context';

const useKeyHandlers = () => {
  const {
    photoManagerFacades,
    setSelectedPhotoManagerFacade,
    setPhotoManagerFacades,
    selectedPhotoManagerFacade,
  } = useApp();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();

      const index = photoManagerFacades.findIndex(
        (facade) => facade.jpgPath === selectedPhotoManagerFacade?.jpgPath
      );
      if (index === -1) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (index === 0) return;
          setSelectedPhotoManagerFacade(photoManagerFacades[index - 1]);
          break;
        case 'ArrowRight':
          if (index === photoManagerFacades.length - 1) return;
          setSelectedPhotoManagerFacade(photoManagerFacades[index + 1]);
          break;
        case 'Delete':
          // setPhotoManagerFacades((prevFacades) => {
          //   return prevFacades.map((facade) => {
          //     if (facade.jpgPath === selectedPhotoManagerFacade?.jpgPath) {
          //       return {
          //         ...facade,
          //         markedForDeletion: true,
          //         isKeeper: false,
          //       };
          //     }
          //     return facade;
          //   });
          // });
          break;
        case ' ':
          // setPhotoManagerFacades((prevFacades) => {
          //   return prevFacades.map((facade) => {
          //     if (facade.jpgPath === selectedPhotoManagerFacade?.jpgPath) {
          //       return {
          //         ...facade,
          //         isKeeper: true,
          //         markedForDeletion: false,
          //       };
          //     }
          //     return facade;
          //   });
          // });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedPhotoManagerFacade, photoManagerFacades]);
};

export default useKeyHandlers;
