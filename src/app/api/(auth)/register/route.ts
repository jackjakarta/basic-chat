import { dbCreateNewUser } from '@/db/functions/user';
import { authProviderSchema } from '@/db/schema';
import { sendUserActionEmail } from '@/email/send';
import { isDevMode } from '@/utils/dev-mode';
import { emailSchema, firstNameSchema, lastNameSchema, passwordSchema } from '@/utils/schemas';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const registerUserRequestSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  authProvider: authProviderSchema,
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const registerUserRequestBody = registerUserRequestSchema.safeParse(json);

    if (!registerUserRequestBody.success) {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const maybeUser = await dbCreateNewUser({
      ...registerUserRequestBody.data,
    });

    if (maybeUser === undefined) {
      return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
    }

    if (!isDevMode) {
      await sendUserActionEmail({
        to: maybeUser.email,
        action: 'verify-email',
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error({ endpoint: '/api/register', error });
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
