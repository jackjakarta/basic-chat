'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient();

export function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session} refetchInterval={120} refetchOnWindowFocus>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
