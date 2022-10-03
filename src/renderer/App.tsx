import { useEffect, useState } from 'react';
import SelectFolder from './src/components/select-folder/SelectFolder';
import './App.css';

interface Image {
  name: string;
  data: string;
}

export default function App() {
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [sampleImages, setSampleImages] = useState<Image[]>([]);

  useEffect(() => {
    if (window.electron) {
      const listener = window.electron.ipcRenderer.on('images', (args) => {
        console.log('got images');
        const images = (args ?? []) as Image[];
        if (images) {
          setSampleImages(images);
        }
      });
      return () => {
        window.electron.ipcRenderer.removeListener('images', listener);
      };
    }
    return undefined;
  }, []);

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

  useEffect(() => {
    if (!selectedFolder) {
      window.electron.ipcRenderer.sendMessage('folder-selection', []);
    }
  }, [selectedFolder]);

  if (!selectedFolder) {
    return (
      <SelectFolder
        selectedFolder={selectedFolder}
        onClearSelection={() => setSelectedFolder(undefined)}
      />
    );
  }

  return (
    <div style={{ overflow: 'scroll', height: '100%' }}>
      <SelectFolder
        selectedFolder={selectedFolder}
        onClearSelection={() => setSelectedFolder(undefined)}
      />
      <div>Images on Folder {selectedFolder}</div>
      {sampleImages
        .filter((_, index) => index < 10)
        .map((image) => (
          <div key={image.name}>
            <img
              width={600}
              height={600}
              src={`data:image/jpeg;charset=utf-8;base64,${image.data}`}
              alt={image.name}
            />
          </div>
        ))}
    </div>
  );
}
