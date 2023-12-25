import { useEffect, useState } from 'react';
import { ImageData } from 'main/types';

import { useApp } from '../context/app-context';
import SelectFolder from '../select-folder/SelectFolder';
import './Layout.css';
import BigPreview from '../big-preview/BigPreview';

const Layout = () => {
  const {
    photoManagerFacades,
    ensureFolderPath,
    folderPath,
    loading,
    selectedPhotoManagerFacade,
    setSelectedPhotoManagerFacade,
  } = useApp();

  const [thumbnails, setThumbnails] = useState<
    { thumbnail: ImageData; jpgPath: string }[]
  >([]);

  useEffect(() => {
    ensureFolderPath();
  }, []);

  useEffect(() => {
    console.log('photoManagerFacades', photoManagerFacades);
    const fetchThumbnails = async () => {
      const tnails = await Promise.all(
        photoManagerFacades.map(async (photoManagerFacade) => {
          const thumbnail = await photoManagerFacade.getThumbnail();
          return { ...photoManagerFacade, thumbnail };
        })
      );
      console.log('thumbnails', tnails);
      setThumbnails(tnails);
    };

    fetchThumbnails();
  }, [photoManagerFacades]);

  const handleImageClick = (jpgPath: string) => {
    setSelectedPhotoManagerFacade(
      photoManagerFacades.find((pmf) => pmf.jpgPath === jpgPath)
    );
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
        {!loading && thumbnails.length === 0 && 'No jpg thumbnails'}
        {thumbnails.map((thumbnail) => (
          <button
            key={thumbnail.thumbnail.pathName}
            onClick={() => handleImageClick(thumbnail.jpgPath)}
            className={`btn ${
              selectedPhotoManagerFacade?.jpgPath === thumbnail.jpgPath
                ? 'selected'
                : ''
            }`}
            type="button"
          >
            <img
              width={200}
              height={200}
              src={`data:image/jpeg;charset=utf-8;base64,${thumbnail.thumbnail.data}`}
              alt="Placeholder @todo replace with alt text in PhotoManager"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
export default Layout;
