'use client';

import { type AIModel } from '@/app/api/chat/types';
import React from 'react';

type ModelContextType = {
  model: AIModel;
  setModel: (model: AIModel) => void;
};

const ModelContext = React.createContext<ModelContextType | undefined>(undefined);

export function LlmModelProvider({
  defaultModel,
  children,
}: {
  defaultModel: AIModel;
  children: React.ReactNode;
}) {
  const [model, setModel] = React.useState<AIModel>(defaultModel);

  return <ModelContext.Provider value={{ model, setModel }}>{children}</ModelContext.Provider>;
}

export function useLlmModel() {
  const context = React.useContext(ModelContext);

  if (context === undefined) {
    throw new Error('useLlmModel must be used within a LlmModelProvider');
  }

  return context;
}
