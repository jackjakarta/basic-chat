import { type Metadata } from 'next';
import { Barlow } from 'next/font/google';

import './globals.css';

const barlow = Barlow({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Next.js template',
    description: 'A template for Next.js projects',
    icons: { icon: '/favicon.ico' },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={barlow.className}>{children}</body>
    </html>
  );
}
