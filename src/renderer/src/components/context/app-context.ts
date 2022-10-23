import React, { useContext } from 'react';
// eslint-disable-next-line import/no-cycle
import { UseApp } from './app-provider';

export const AppContext = React.createContext<UseApp | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error('useApp needs to be used inside an AppProvider');
  return context;
};
