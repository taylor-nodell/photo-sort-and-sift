import React, { useState } from 'react';
import './CreateSubjectKeeperModal.css'; // Add your modal styles here
import { useApp } from '../context/app-context';

export const CreateSubjectKeeperModal = () => {
  const {
    setIsCreatingSubjectKeeper,
    setSubjectKeepers,
    setCurrentSubjectKeeper,
  } = useApp();

  const [newSubjectKeeperName, setNewSubjectKeeperName] = useState('');
  console.log('Current Input Value:', newSubjectKeeperName);

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
        <h1>New Subject</h1>
        {/* Text field for entering name of the subject keeper */}
        <input
          type="text"
          placeholder="Name of Subject"
          value={newSubjectKeeperName}
          onChange={(e) => setNewSubjectKeeperName(e.target.value)}
        />
        {/* Button for creating a new subject keeper */}
        <button onClick={handleCreateNewSubjectKeeper}>Create</button>
      </div>
    </div>
  );
};
