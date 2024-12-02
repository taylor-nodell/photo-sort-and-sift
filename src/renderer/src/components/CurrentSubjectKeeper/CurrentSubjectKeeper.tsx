import { useApp } from '../context/app-context';

import './CurrentSubjectKeeper.css';

export const CurrentSubjectKeeper = () => {
  const { currentSubjectKeeperId, subjectKeepers } = useApp();

  return (
    <div className="current-subject-keeper">
      <p>Current Subject:</p>
      <p>
        {currentSubjectKeeperId
          ? subjectKeepers.find(
              (subjectKeeper) => subjectKeeper.id === currentSubjectKeeperId
            )?.name
          : 'None'}
      </p>
    </div>
  );
};
