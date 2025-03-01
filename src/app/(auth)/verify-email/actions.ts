'use server';

import { dbDeleteActionToken, dbValidateToken } from '@/db/functions/token';
import { z } from 'zod';

const requestSchema = z.object({
  token: z.string(),
});

type VerifyEmailCodeRequestBody = z.infer<typeof requestSchema>;

export async function verifyEmailCodeAction(body: VerifyEmailCodeRequestBody) {
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error('Invalid request body');
  }

  const { token } = parsed.data;
  const verifiedCode = await dbValidateToken(token);

  if (verifiedCode === undefined) {
    throw new Error('Invalid token');
  }

  await dbDeleteActionToken({ token });

  return verifiedCode;
}
