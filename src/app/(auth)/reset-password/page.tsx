import { dbValidateToken } from '@/db/functions/token';
import { getMaybeUser } from '@/utils/auth';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

import InitiatePasswordResetForm from './initiate-password-reset';
import ResetPasswordForm from './reset-password-form';

const pageContextSchema = z.object({
  searchParams: z.object({
    token: z.string().optional(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getMaybeUser();

  if (user !== undefined) {
    redirect('/');
  }

  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const {
    searchParams: { token },
  } = parsedParams.data;

  const maybeToken = token;
  const userActionRow = maybeToken !== undefined ? await dbValidateToken(maybeToken) : undefined;

  return (
    <>
      {userActionRow !== undefined ? (
        <ResetPasswordForm {...userActionRow} />
      ) : (
        <InitiatePasswordResetForm />
      )}
    </>
  );
}
