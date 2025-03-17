import crypto from 'crypto';

import { type UserRow } from '@/db/schema';

export type ObscuredUser = Omit<UserRow, 'passwordHash'>;

export function obscureUser(user: UserRow): ObscuredUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    authProvider: user.authProvider,
    settings: user.settings,
    createdAt: user.createdAt,
  };
}

export function getUserAvatarUrl({ email, size }: { email: string; size?: number }) {
  const trimmedEmail = email.trim().toLowerCase();
  const imageSize = size ?? 200;

  const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
  const avatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${imageSize}&d=identicon`;

  return avatarUrl;
}
