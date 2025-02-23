'use client';

import { signOut } from 'next-auth/react';

type SignOutButtonProps = Omit<React.ComponentProps<'button'>, 'onClick'> & {
  callbackUrl?: string;
};

export default function SignOutButton({ callbackUrl, ...props }: SignOutButtonProps) {
  return (
    <button onClick={() => signOut({ callbackUrl: callbackUrl ?? '/' })} {...props}>
      Logout
    </button>
  );
}
