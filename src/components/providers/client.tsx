'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ShortcutsDialog from '../common/shortcuts-dialog';
import { useKeyboardShortcut } from '../hooks/use-keyboard-shortcut';
import { CommandMenuProvider } from './command-menu';

const queryClient = new QueryClient();

export function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const router = useRouter();
  const shortcutsDialogRef = React.useRef<HTMLButtonElement | null>(null);

  useKeyboardShortcut({
    key: 'o',
    callbackFn: () => router.push('/'),
    withShift: true,
  });

  useKeyboardShortcut({
    key: '/',
    callbackFn: () => shortcutsDialogRef.current?.click(),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <CommandMenuProvider>
          {children}
          <ShortcutsDialog hidden buttonRef={shortcutsDialogRef} />
        </CommandMenuProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
