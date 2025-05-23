'use client';

import { AIModelRow } from '@/db/schema';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import SelectLlmModel from '../chat/select-llm';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import NewChatButton from './new-chat-button';

type HeaderProps = {
  agentName?: string;
  models?: AIModelRow[];
};

export default function Header({ agentName, models }: HeaderProps) {
  const t = useTranslations('settings');
  const pathname = usePathname();

  const { open: isSidebarOpen } = useSidebar();

  const isEmptyChat = pathname === '/';
  const isSettingsPath = pathname.startsWith('/settings');

  return (
    <div className="flex items-center gap-4 p-4">
      <SidebarTrigger />
      {!isSidebarOpen && <NewChatButton disabled={isEmptyChat} className="mr-2" />}
      {models !== undefined && models.length > 0 && <SelectLlmModel models={models} />}

      {agentName !== undefined && (
        <h1 className="text-secondary-foreground text-md font-normal">{agentName}</h1>
      )}

      {isSettingsPath && (
        <h1 className="text-secondary-foreground text-lg font-medium">{t('title')}</h1>
      )}
    </div>
  );
}
