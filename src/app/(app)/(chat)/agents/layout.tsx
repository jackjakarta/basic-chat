import Header from '@/components/common/header';
import { metadataTitle } from '@/utils/metadata';
import { type Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${metadataTitle} - Agents`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
