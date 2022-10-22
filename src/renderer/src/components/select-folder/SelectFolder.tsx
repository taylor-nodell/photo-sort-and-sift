import { useApp } from '../context/app-context';
import './SelectFolder.css';

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
