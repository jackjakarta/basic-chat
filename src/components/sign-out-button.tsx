'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

type SignOutButtonProps = {
  className?: React.ComponentProps<'button'>['className'];
};

export default function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <button onClick={() => void signOut({ callbackUrl: '/' })} className={className}>
      Logout
    </button>
  );
}
