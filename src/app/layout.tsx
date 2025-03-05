import { ThemeProvider } from '@/components/providers/theme';
import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Barlow } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import './globals.css';

const barlow = Barlow({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Chat Template',
    description: 'A template for AI chat bot projects',
    icons: { icon: '/favicon.ico' },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html lang={locale}>
      <body className={barlow.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Toaster />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
