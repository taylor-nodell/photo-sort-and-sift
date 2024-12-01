import { useApp } from '../context/app-context';
import './SelectFolder.css';

// @TODO: This component is no longer used, remove it
const SelectFolder = () => {
  const { folderPath, changeFolder } = useApp();

  const onSelectFolder = () => {
    changeFolder();
  };

  return (
    <div className="selectFolderContainer">
      <button onClick={onSelectFolder} type="button">
        {folderPath ? 'Change' : 'Select'} Folder
      </button>
    </div>
  );
};

export default SelectFolder;
