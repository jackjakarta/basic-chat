import { generateCode } from '@/utils/nanoid';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { db } from '..';
import { tokenTable, userTable, type TokenAction, type TokenRow } from '../schema';

export async function dbValidateToken(token: string): Promise<TokenRow | undefined> {
  const tokenModel = (await db.select().from(tokenTable).where(eq(tokenTable.token, token)))[0];
  const currentDate = new Date();

  if (
    tokenModel?.expiresAt !== null &&
    tokenModel?.expiresAt !== undefined &&
    tokenModel?.expiresAt < currentDate
  ) {
    return undefined;
  }

  if (tokenModel?.action === 'verify-email' && tokenModel.email !== null) {
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.email, tokenModel.email));
  }

  return tokenModel;
}

export async function dbInsertOrUpdateActionToken({
  email,
  action,
}: {
  email: string;
  action: TokenAction;
}): Promise<TokenRow | undefined> {
  try {
    const token = action === 'verify-email' ? generateCode({ length: 6 }) : nanoid(32);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 30 * 60 * 1000);

    const result = (
      await db
        .insert(tokenTable)
        .values({ email, token, action, createdAt, expiresAt })
        .onConflictDoUpdate({
          target: [tokenTable.email, tokenTable.action],
          set: { token, createdAt, expiresAt },
        })
        .returning()
    )[0];

    return result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function dbDeleteActionToken({ token }: { token: string }) {
  await db.delete(tokenTable).where(eq(tokenTable.token, token));
}
