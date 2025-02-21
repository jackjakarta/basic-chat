'use client';

import { type AIModel } from '@/app/api/chat/models';
import React from 'react';

type ModelContextType = {
  model: AIModel;
  setModel: (model: AIModel) => void;
};

const ModelContext = React.createContext<ModelContextType | undefined>(undefined);

export function LlmModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = React.useState<AIModel>('gpt-4o');

  return <ModelContext.Provider value={{ model, setModel }}>{children}</ModelContext.Provider>;
}

export function useLlmModel() {
  const context = React.useContext(ModelContext);

  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }

  return context;
}
