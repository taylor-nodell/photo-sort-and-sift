import { useApp } from '../context/app-context';
import './KeeperLog.css';

export const KeeperLog = () => {
  const { subjectKeepers } = useApp();

  return (
    <div className="keeper-log">
      <p>Keepers </p>
      {subjectKeepers.map((keeper) => (
        <div key={keeper.id}>
          <p>{keeper.name}</p>
          <p>
            {keeper.imagePackages.map((imagePackage) => (
              <span key={imagePackage.id}>{imagePackage.jpegPath}</span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
};
