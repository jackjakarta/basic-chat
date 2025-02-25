import { dbValidateToken } from '@/db/functions/token';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

import TokenVerifyFail from './token-verify-fail';

const pageContextSchema = z.object({
  searchParams: z.object({
    token: z.string(),
  }),
});

export default async function Page(context: unknown) {
  const result = pageContextSchema.safeParse(context);

  if (!result.success) {
    return notFound();
  }

  const parsedToken = result.data.searchParams.token;
  const userActionToken = await dbValidateToken(parsedToken);

  if (userActionToken === undefined) {
    return <TokenVerifyFail />;
  }

  if (userActionToken.action === 'reset-password') {
    redirect(`/reset-password?token=${userActionToken.token}`);
  }

  return notFound();
}
