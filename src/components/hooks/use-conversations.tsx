'use client';

import { type ConversationRow } from '@/db/schema';
import React from 'react';

type ConversationContextValue = {
  conversations: ConversationRow[];
  addConversation: (conversation: ConversationRow) => void;
};

const ConversationContext = React.createContext<ConversationContextValue | undefined>(undefined);

type ProviderProps = {
  initialConversations: ConversationRow[];
  children: React.ReactNode;
};

export function ConversationProvider({ initialConversations, children }: ProviderProps) {
  const [conversations, setConversations] = React.useState<ConversationRow[]>(initialConversations);

  const addConversation = React.useCallback((conversation: ConversationRow) => {
    setConversations((prev) => [...prev, conversation]);
  }, []);

  return (
    <ConversationContext.Provider value={{ conversations, addConversation }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const context = React.useContext(ConversationContext);

  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }

  return context;
}
