import { useApp } from '../context/app-context';
import './BigPreview.css';

const BigPreview = () => {
  const { selectedImage } = useApp();

  return selectedImage ? (
    <div className="BigPreviewContainer">
      <div key={selectedImage.jpegPath}>
        <img
          src={`data:image/jpeg;charset=utf-8;base64,${selectedImage.bigPreview.data}`}
          alt={selectedImage.jpegPath}
        />
      </div>
    </div>
  ) : null;
};

export default BigPreview;
