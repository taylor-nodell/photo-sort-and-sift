import './ReviewScreen.css';
import { useApp } from '../context/app-context';
import { KeeperLog } from '../KeeperLog/KeeperLog';

export const ReviewScreen = () => {
  const { subjectKeepers } = useApp();
  console.log(subjectKeepers);
  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <h1>Review </h1>
        <KeeperLog />
        <button
          onClick={() => {
            // Send the subjectKeepers to the main process
            window.electron.ipcRenderer.sendMessage('sort-keepers', [
              subjectKeepers,
            ]);
          }}
          type="button"
        >
          Save
        </button>
      </div>
    </div>
  );
};
