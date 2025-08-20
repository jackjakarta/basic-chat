'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

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

  useKeyboardShortcut({
    key: 'o',
    callbackFn: () => router.push('/'),
    withShift: true,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <CommandMenuProvider>{children}</CommandMenuProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
