'use client';

import { cw } from '@/utils/tailwind';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const itemClassName =
  'text-secondary-foreground font-normal px-4 py-2 rounded-xl hover:bg-muted/20';

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 w-44">
      <Link
        href="/settings/profile"
        className={cw(itemClassName, pathname === '/settings/profile' && 'bg-accent/40')}
      >
        Profile
      </Link>
      <Link href="#" className={cw(itemClassName)}>
        Billing
      </Link>
      <Link href="#" className={cw(itemClassName, pathname === '/settings' && 'bg-accent/40')}>
        Preferences
      </Link>
    </nav>
  );
}
