import SessionProvider from '@/components/session-provider';
import { getMaybeUserSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getMaybeUserSession();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
