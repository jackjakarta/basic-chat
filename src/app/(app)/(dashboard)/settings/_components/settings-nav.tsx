'use client';

import { type SubscriptionState } from '@/stripe/subscription';
import { cw } from '@/utils/tailwind';
import { Settings2, Unplug, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

export default function SettingsNav({ userSubscription }: { userSubscription: SubscriptionState }) {
  const pathname = usePathname();
  const t = useTranslations('settings');
  const hasPremiumAccess = userSubscription !== 'free';

  const menuItems: MenuItem[] = [
    {
      label: t('profile.title'),
      icon: <User className="w-[18px] h-[18px]" />,
      href: '/settings/profile',
    },
    ...(hasPremiumAccess
      ? [
          {
            label: 'Integrations',
            icon: <Unplug className="w-[18px] h-[18px]" />,
            href: '/settings/integrations',
          },
        ]
      : []),
    {
      label: t('preferences.title'),
      icon: <Settings2 className="w-[18px] h-[18px]" />,
      href: '/settings/preferences',
    },
  ];

  return (
    <nav className="flex flex-col gap-2 w-full md:w-44">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cw(
            'flex items-center gap-2 text-secondary-foreground font-normal px-4 py-2 rounded-xl hover:bg-muted/20',
            pathname === item.href && 'bg-accent/40',
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
