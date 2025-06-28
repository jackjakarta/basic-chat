'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const queryClient = new QueryClient();

export function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'o' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();

        if (pathname !== '/') {
          router.push('/');
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
