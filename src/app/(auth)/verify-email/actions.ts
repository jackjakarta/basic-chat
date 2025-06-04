'use server';

import { dbDeleteActionToken, dbValidateToken } from '@/db/functions/token';
import { z } from 'zod';

const requestSchema = z.object({
  code: z.string(),
});

type VerifyEmailCodeRequestBody = z.infer<typeof requestSchema>;

export async function verifyEmailCodeAction(body: VerifyEmailCodeRequestBody) {
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error('Invalid request body');
  }

  const { code } = parsed.data;
  const verifiedCode = await dbValidateToken(code);

  if (verifiedCode === undefined) {
    throw new Error('Invalid token');
  }

  await dbDeleteActionToken({ token: code });

  return verifiedCode;
}
