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
    customerId: user.customerId,
    isSuperAdmin: user.isSuperAdmin,
    customFreeTrial: user.customFreeTrial,
    settings: user.settings,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function getUserAvatarUrl({ email, size }: { email: string; size?: number }) {
  const trimmedEmail = email.trim().toLowerCase();
  const imageSize = size ?? 200;

  const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
  const avatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${imageSize}&d=identicon`;

  return avatarUrl;
}
