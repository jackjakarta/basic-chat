'use client';

import { usePathname } from 'next/navigation';

import SelectLlmModel from '../chat/select-llm';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import NewChatButton from './new-chat-button';

type HeaderProps = {
  modelsSelect?: boolean;
};

export default function Header({ modelsSelect }: HeaderProps) {
  const pathname = usePathname();
  const { open } = useSidebar();

  const isEmptyChat = pathname === '/';
  const isSettingsPath = pathname.startsWith('/settings');

  return (
    <div className="flex items-center gap-4 p-4">
      <SidebarTrigger />
      {!open && <NewChatButton disabled={isEmptyChat} className="mr-2" />}
      {modelsSelect && <SelectLlmModel />}
      {isSettingsPath && (
        <h1 className="text-secondary-foreground text-lg font-medium">Settings</h1>
      )}
    </div>
  );
}
