import { type ObscuredUser } from '@/utils/user';
import { eq } from 'drizzle-orm';

import { db } from '..';
import { hashPassword, verifyPassword } from '../crypto';
import { DatabaseError } from '../error';
import {
  agentTable,
  conversationMessageTable,
  conversationTable,
  userTable,
  vectorStoreTable,
  type InsertUserRow,
  type UserRow,
} from '../schema';

export async function dbCreateNewUser({
  email,
  firstName,
  lastName,
  password,
  authProvider,
  emailVerified,
}: Omit<InsertUserRow, 'passwordHash'> & { password: string }) {
  try {
    const maybeUser = (await db.select().from(userTable).where(eq(userTable.email, email)))[0];

    if (maybeUser !== undefined) {
      throw new Error('This email already exists');
    }

    const maybePassword = authProvider === 'credentials' ? await hashPassword(password) : '';

    const newUser = (
      await db
        .insert(userTable)
        .values({
          email,
          passwordHash: maybePassword,
          firstName,
          lastName,
          emailVerified,
          authProvider,
        })
        .returning()
    )[0];

    if (newUser === undefined) {
      throw new Error("Couldn't create user");
    }

    return newUser;

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
}): Promise<ObscuredUser | undefined> {
  const [userModel] = await db.select().from(userTable).where(eq(userTable.email, email));

  if (userModel === undefined) {
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
  const [user] = await db.select().from(userTable).where(eq(userTable.id, userId));

  return user;
}

export async function dbGetUserByEmail({ email }: { email: string }): Promise<UserRow | undefined> {
  const [user] = await db.select().from(userTable).where(eq(userTable.email, email));

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

  const [user] = await db
    .update(userTable)
    .set({ passwordHash })
    .where(eq(userTable.email, email))
    .returning();

  return user;
}

export async function dbDeleteUser({ userId }: { userId: string }) {
  await db.transaction(async (tx) => {
    await tx.delete(conversationMessageTable).where(eq(conversationMessageTable.userId, userId));
    await tx.delete(conversationTable).where(eq(conversationTable.userId, userId));
    await tx.delete(agentTable).where(eq(agentTable.userId, userId));
    await tx.delete(vectorStoreTable).where(eq(vectorStoreTable.userId, userId));
    await tx.delete(userTable).where(eq(userTable.id, userId));
  });
}

export async function dbUpdateUserSettings({
  userId,
  customInstructions,
}: {
  userId: string;
  customInstructions: string;
}): Promise<UserRow | undefined> {
  const [user] = await db
    .update(userTable)
    .set({ settings: { customInstructions } })
    .where(eq(userTable.id, userId))
    .returning();

  return user;
}

export async function dbUpdateUserName({
  userId,
  firstName,
  lastName,
}: {
  userId: string;
  firstName: string;
  lastName: string;
}): Promise<UserRow | undefined> {
  const [user] = await db
    .update(userTable)
    .set({ firstName, lastName })
    .where(eq(userTable.id, userId))
    .returning();

  return user;
}

export async function dbUpdateUserCustomerId({
  userId,
  customerId,
}: {
  userId: string;
  customerId: string;
}): Promise<UserRow | undefined> {
  const [user] = await db
    .update(userTable)
    .set({ customerId })
    .where(eq(userTable.id, userId))
    .returning();

  return user;
}
