'use client';

import { usePathname } from 'next/navigation';

import SelectLlmModel from '../chat/select-llm';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import NewChatButton from './new-chat-button';

export default function Header() {
  const pathname = usePathname();
  const { open } = useSidebar();

  const isEmptyChat = pathname === '/';

  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger className="ml-2 mt-2 p-4" />
      {!open && <NewChatButton disabled={isEmptyChat} className="mt-2 p-4 mr-2" />}
      <SelectLlmModel />
    </div>
  );
}
