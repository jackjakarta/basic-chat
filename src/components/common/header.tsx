'use client';

import { AIModelRow } from '@/db/schema';

import SelectLlmModel from '../chat/select-llm';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import NewChatButton from './new-chat-button';

type HeaderProps = {
  title?: string;
  models?: AIModelRow[];
  isEmptyChat?: boolean;
};

export default function Header({ title, models, isEmptyChat }: HeaderProps) {
  const { open: isSidebarOpen } = useSidebar();

  return (
    <div className="flex items-center gap-4 p-4">
      <SidebarTrigger />
      {!isSidebarOpen && <NewChatButton className="mr-2" disabled={isEmptyChat} />}
      {models !== undefined && models.length > 0 && <SelectLlmModel models={models} />}

      {title !== undefined && (
        <h1 className="text-md font-normal text-secondary-foreground">{title}</h1>
      )}
    </div>
  );
}
