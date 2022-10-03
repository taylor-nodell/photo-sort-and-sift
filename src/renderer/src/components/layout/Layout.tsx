import { useEffect, useState } from 'react';
import SelectFolder from '../select-folder/SelectFolder';
import './Layout.css';

const Layout = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();

  useEffect(() => {
    if (window.electron) {
      const listener = window.electron.ipcRenderer.on(
        'folder-selection',
        (args) => {
          const path = args as string;
          if (path) {
            setSelectedFolder(path);
          }
        }
      );
      return () =>
        window.electron.ipcRenderer.removeListener(
          'folder-selection',
          listener
        );
    }
    return undefined;
  }, [selectedFolder]);
  return (
    <div className="main">
      <div className="top">Top</div>
      <div className="bottom">
        <SelectFolder
          selectedFolder={selectedFolder}
          onClearSelection={() => setSelectedFolder(undefined)}
        />
      </div>
    </div>
  );
};
export default Layout;
