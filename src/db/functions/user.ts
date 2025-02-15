import { eq } from 'drizzle-orm';

import { db } from '..';
import { hashPassword, verifyPassword } from '../crypto';
import { DatabaseError } from '../error';
import { userTable, type InsertUserRow, type UserRow } from '../schema';

export async function dbCreateNewUser({
  email,
  firstName,
  lastName,
  password,
}: Omit<InsertUserRow, 'passwordHash'> & { password: string }) {
  try {
    const maybeUser = await db.select().from(userTable).where(eq(userTable.email, email));

    if (maybeUser.length > 0) {
      throw Error('This email already exists');
    }

    const user = (
      await db
        .insert(userTable)
        .values({
          email,
          passwordHash: await hashPassword(password),
          firstName,
          lastName,
        })
        .returning()
    )[0];

    if (user === undefined) {
      throw Error();
    }

    return user;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new DatabaseError(error);
  }
}

export async function dbGetAuthenticatedUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const userModel = (await db.select().from(userTable).where(eq(userTable.email, email)))[0];

  if (!userModel) {
    return undefined;
  }

  const passwordVerified = await verifyPassword(password, userModel.passwordHash);
  if (!passwordVerified) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...obscuredUserModel } = userModel;

  return obscuredUserModel;
}

export async function dbGetUserById({ userId }: { userId: string }): Promise<UserRow | undefined> {
  const user = (await db.select().from(userTable).where(eq(userTable.id, userId)))[0];

  return user;
}

export async function dbGetUserByEmail({ email }: { email: string }): Promise<UserRow | undefined> {
  const user = (await db.select().from(userTable).where(eq(userTable.email, email)))[0];

  return user;
}

export async function dbUpdateUserPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<UserRow | undefined> {
  const passwordHash = await hashPassword(password);

  const user = (
    await db.update(userTable).set({ passwordHash }).where(eq(userTable.email, email)).returning()
  )[0];

  return user;
}
