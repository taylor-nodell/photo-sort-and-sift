import React, { useEffect, useRef, useState } from 'react';
import './CreateSubjectKeeperModal.css'; // Add your modal styles here
import { useApp } from '../context/app-context';

export const CreateSubjectKeeperModal = () => {
  const {
    setIsCreatingSubjectKeeper,
    setSubjectKeepers,
    setCurrentSubjectKeeper,
  } = useApp();

  const [newSubjectKeeperName, setNewSubjectKeeperName] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCreateNewSubjectKeeper = () => {
    // Create a new subject keeper
    // set the current subject keeper
    // setisCreatingSubjectKeeper to false
    const newSubjectKeeper = {
      id: Math.random().toString(), // @todo: use a better id generator
      name: newSubjectKeeperName,
      imagePackages: [],
    };
    setSubjectKeepers((prevSubjectKeepers) => [
      ...prevSubjectKeepers,
      newSubjectKeeper,
    ]);
    setCurrentSubjectKeeper(newSubjectKeeper);
    setIsCreatingSubjectKeeper(false);
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
          ref={inputRef}
        />
        <button type="button" onClick={handleCreateNewSubjectKeeper}>
          Create
        </button>
      </div>
    </div>
  );
};
