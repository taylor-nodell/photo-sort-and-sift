import { useApp } from '../context/app-context';

import './CurrentSubjectKeeper.css';

export const CurrentSubjectKeeper = () => {
  const { currentSubjectKeeper } = useApp();

  return (
    <div className="current-subject-keeper">
      <p>Current Subject:</p>
      <p>{currentSubjectKeeper?.name}</p>
    </div>
  );
};
