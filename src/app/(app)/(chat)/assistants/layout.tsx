import { metadataTitle } from '@/utils/metadata';
import { type Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${metadataTitle} - Assistants`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
