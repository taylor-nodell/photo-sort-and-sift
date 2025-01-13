import { useEffect, useRef, useState } from 'react';
import './CreateSubjectKeeperModal.css';
import { useApp } from '../context/app-context';

export const CreateSubjectKeeperModal = () => {
  const {
    setIsCreatingSubjectKeeper,
    setSubjectKeepers,
    setCurrentSubjectKeeperId,
    selectedImage,
  } = useApp();

  const [newSubjectKeeperName, setNewSubjectKeeperName] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      // Delay focusing the input to avoid the initial 'n' key being typed - @todo: find a better solution
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer); // Cleanup the timeout
    }

    // Return a no-op cleanup function when the condition is not met
    return () => {};
  }, []);

  const handleCreateNewSubjectKeeper = () => {
    if (!newSubjectKeeperName) return;
    if (!selectedImage) return;

    // Create a new subject keeper
    // set the current subject keeper
    // setisCreatingSubjectKeeper to false
    const newSubjectKeeper = {
      id: Math.random().toString(), // @todo: use a better id generator
      name: newSubjectKeeperName,
      imagePackages: [selectedImage],
    };
    setSubjectKeepers((prevSubjectKeepers) => [
      ...prevSubjectKeepers,
      newSubjectKeeper,
    ]);
    setCurrentSubjectKeeperId(newSubjectKeeper.id);
    setIsCreatingSubjectKeeper(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCreateNewSubjectKeeper();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1 id="new-subject-header">New Subject</h1>
        <input
          aria-labelledby="new-subject-header"
          type="text"
          placeholder="Name of Subject"
          value={newSubjectKeeperName}
          onChange={(e) => setNewSubjectKeeperName(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        <button
          type="submit"
          onClick={handleCreateNewSubjectKeeper}
          disabled={!newSubjectKeeperName || !selectedImage}
        >
          Create
        </button>
      </div>
    </div>
  );
};
