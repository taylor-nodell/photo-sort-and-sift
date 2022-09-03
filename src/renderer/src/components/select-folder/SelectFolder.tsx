import './SelectFolder.css';

interface Props {
  selectedFolder: string | undefined;
  onClearSelection: () => void;
}

export default function SelectFolder({
  selectedFolder,
  onClearSelection,
}: Props) {
  const onSelectFolder = () => {
    window.electron.ipcRenderer.sendMessage('folder-selection', []);
  };
  const onSelectAnother = () => {
    onSelectFolder();
    onClearSelection();
  };

  return (
    <div className="selectFolderContainer">
      {selectedFolder ? (
        <>
          <div className="pathContainer">
            Selected folder:{' '}
            <div className="selectFolderPath">{selectedFolder}</div>
          </div>
          <button onClick={onSelectAnother} type="button">
            Select Another
          </button>
        </>
      ) : (
        <>
          <div>Where are your images 🤔?</div>
          <button onClick={onSelectFolder} type="button">
            Select Folder
          </button>
        </>
      )}
    </div>
  );
}
