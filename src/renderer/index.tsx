import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

if (window.electron) {
  window.electron.ipcRenderer.sendMessage('folder-selection', [
    'change-folder',
  ]);

  window.electron.ipcRenderer.on('processedImages', (images) => {
    console.log('Received images:', images);
  });
} else {
  console.error('window.electron is undefined. Check your preload script.');
}
