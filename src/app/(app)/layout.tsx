import { getValidSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await getValidSession();

  return <>{children}</>;
}
