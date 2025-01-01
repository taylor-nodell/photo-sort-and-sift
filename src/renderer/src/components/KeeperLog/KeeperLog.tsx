import { useApp } from '../context/app-context';
import './KeeperLog.css';

export const KeeperLog = () => {
  const { subjectKeepers } = useApp();

  const shortenedJpegPath = (jpegPath: string) => {
    // Show everything past the last slash
    const lastSlash = jpegPath.lastIndexOf('/');
    const shortenedPath = jpegPath.slice(lastSlash + 1);
    return shortenedPath;
  };

  return (
    <div className="keeper-log">
      <p>Keepers </p>
      {subjectKeepers.map((keeper) => (
        <div key={keeper.id}>
          <p>{keeper.name}</p>
          <p>
            {keeper.imagePackages.map((imagePackage) => (
              <p key={imagePackage.id}>
                {shortenedJpegPath(imagePackage.jpegPath)}
              </p>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
};
