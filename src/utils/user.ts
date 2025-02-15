import { type UserRow } from '@/db/schema';

export type ObscuredUser = Omit<UserRow, 'passwordHash'>;

export function obscureUser(user: UserRow): ObscuredUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}
