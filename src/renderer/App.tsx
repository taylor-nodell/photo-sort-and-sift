import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SelectFolder from './src/components/select-folder/SelectFolder';
import './App.css';

export default function App() {
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
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SelectFolder
              selectedFolder={selectedFolder}
              onClearSelection={() => setSelectedFolder(undefined)}
            />
          }
        />
      </Routes>
    </Router>
  );
}
