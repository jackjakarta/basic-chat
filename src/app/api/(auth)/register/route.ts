import { dbCreateNewUser } from '@/db/functions/user';
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
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const registerUserRequestBody = registerUserRequestSchema.parse(json);

    const maybeUser = await dbCreateNewUser({
      ...registerUserRequestBody,
    });

    if (maybeUser === undefined) {
      return NextResponse.json({ success: false, error: 'User does not exist' }, { status: 404 });
    }

    if (!isDevMode) {
      await sendUserActionEmail({
        to: maybeUser.email,
        action: 'verify-email',
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to register:', { error });
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
