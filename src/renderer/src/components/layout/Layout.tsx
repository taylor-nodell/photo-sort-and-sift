import { useEffect } from 'react';
import { useApp } from '../context/app-context';
import SelectFolder from '../select-folder/SelectFolder';
import './Layout.css';

const Layout = () => {
  const { images, ensureFolderPath, folderPath, loading } = useApp();

  useEffect(() => {
    ensureFolderPath();
  }, [ensureFolderPath]);

  return (
    <div className="main">
      <div className="top">
        {loading && 'Loading...'}
        {!loading && images.length === 0 && 'No jpg images'}
        {images
          .filter((_, index) => index < 10)
          .map((image) => (
            <div key={image.id}>
              <img
                width={600}
                height={600}
                src={`data:image/jpeg;charset=utf-8;base64,${image.data}`}
                alt={image.id}
              />
            </div>
          ))}
      </div>
      <div className="bottom">
        <SelectFolder />
        <div>Path: {folderPath}</div>
      </div>
    </div>
  );
};
export default Layout;
