'use client';

import { AIModelRow, type ChatProjectRow } from '@/db/schema';
import { type WithConversations } from '@/db/types';

import SelectLlmModel from '../chat/select-llm';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import DynamicIcon from './dynamic-icon';
import NewChatButton from './new-chat-button';

type HeaderProps = {
  assistantName?: string;
  chatProject?: WithConversations<ChatProjectRow>;
  models?: AIModelRow[];
  isEmptyChat?: boolean;
};

export default function Header({ assistantName, chatProject, models, isEmptyChat }: HeaderProps) {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <div className="flex items-center gap-4 p-4">
      <SidebarTrigger />
      {!isSidebarOpen && <NewChatButton className="mr-2" disabled={isEmptyChat} />}
      {models !== undefined && models.length > 0 && <SelectLlmModel models={models} />}

      {assistantName !== undefined && (
        <span className="text-md font-normal text-secondary-foreground">{assistantName}</span>
      )}

      {chatProject !== undefined && (
        <div className="flex items-center gap-2">
          <DynamicIcon
            name={chatProject.icon}
            iconColor={chatProject.iconColor}
            className="size-4"
          />
          <span className="text-sm font-normal text-secondary-foreground">{chatProject.name}</span>
        </div>
      )}
    </div>
  );
}
