import { ClientProvider } from '@/components/providers/client-provider';
import { getMaybeUserSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getMaybeUserSession();

  return <ClientProvider session={session}>{children}</ClientProvider>;
}
