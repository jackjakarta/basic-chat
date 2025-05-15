'use client';

import React from 'react';

type ModelContextType = {
  model: string;
  setModel: (model: string) => void;
};

const ModelContext = React.createContext<ModelContextType | undefined>(undefined);

export function LlmModelProvider({
  defaultModel,
  children,
}: {
  defaultModel: string;
  children: React.ReactNode;
}) {
  const [model, setModel] = React.useState<string>(defaultModel);

  return <ModelContext.Provider value={{ model, setModel }}>{children}</ModelContext.Provider>;
}

export function useLlmModel() {
  const context = React.useContext(ModelContext);

  if (context === undefined) {
    throw new Error('useLlmModel must be used within a LlmModelProvider');
  }

  return context;
}
