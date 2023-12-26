import { useEffect, useState } from 'react';
import { ImageData } from 'main/types';

import { useApp } from '../context/app-context';
import './BigPreview.css';

const BigPreview = () => {
  const { selectedPhotoManagerFacade } = useApp();
  const [selectedBigPreview, setSelectedBigPreview] = useState<ImageData>();
  useEffect(() => {
    if (!selectedPhotoManagerFacade) {
      return;
    }
    console.log('selectedPhotoManagerFacade', selectedPhotoManagerFacade);
    const fetchBigPreview = async () => {
      const bigPreview = await selectedPhotoManagerFacade.getBigPreview();
      console.log('bigPreview', bigPreview);
      setSelectedBigPreview(bigPreview);
    };
    fetchBigPreview();
  }, [selectedPhotoManagerFacade]);
  return selectedBigPreview ? (
    <div className="BigPreviewContainer">
      <div key={selectedBigPreview.pathName}>
        <img
          src={`data:image/jpeg;charset=utf-8;base64,${selectedBigPreview.data}`}
          alt="@todo replace with alt text"
        />
      </div>
    </div>
  ) : null;
};

export default BigPreview;
