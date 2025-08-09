'use client';

import React from 'react';

import SearchCommandMenu from '../common/search-command';

type CommandMenuContextValue = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommandMenuContext = React.createContext<CommandMenuContextValue | undefined>(undefined);

export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <CommandMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <SearchCommandMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  const context = React.useContext(CommandMenuContext);

  if (!context) {
    throw new Error('useCommandMenu must be used within a CommandMenuProvider');
  }

  return context;
}
