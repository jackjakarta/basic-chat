import { randomBytes } from 'crypto';

import { eq } from 'drizzle-orm';

import { db } from '..';
import { tokenTable, userTable, type TokenAction, type TokenRow } from '../schema';

export async function dbValidateToken(token: string): Promise<TokenRow | undefined> {
  const tokenModel = (await db.select().from(tokenTable).where(eq(tokenTable.token, token)))[0];

  if (tokenModel?.action === 'verify-email' && tokenModel.email !== null) {
    await db
      .update(userTable)
      .set({ emailVerified: true })
      .where(eq(userTable.email, tokenModel.email));

    return tokenModel;
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
    const token = randomBytes(20).toString('hex');
    const createdAt = new Date();

    const result = await db
      .insert(tokenTable)
      .values({ email, token, action, createdAt })
      .onConflictDoUpdate({
        target: [tokenTable.email, tokenTable.action],
        set: { token, createdAt },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function dbDeleteActionToken({ token }: { token: string }) {
  await db.delete(tokenTable).where(eq(tokenTable.token, token));
}
