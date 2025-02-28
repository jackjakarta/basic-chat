'use client';

import { signOut } from 'next-auth/react';

type SignOutButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> & {
  children: React.ReactNode;
  callbackUrl?: string;
};

export default function SignOutButton({ children, callbackUrl, ...props }: SignOutButtonProps) {
  return (
    <button onClick={() => signOut({ callbackUrl: callbackUrl ?? '/' })} {...props}>
      {children}
    </button>
  );
}
