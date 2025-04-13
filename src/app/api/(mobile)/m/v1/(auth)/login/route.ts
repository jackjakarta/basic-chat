import { dbGetAuthenticatedUser } from '@/db/functions/user';
import { env } from '@/env';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const jwtSecret = env.jwtSecret;

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const loginUserRequest = loginUserRequestSchema.parse(json);

    const maybeUser = await dbGetAuthenticatedUser({
      email: loginUserRequest.email.toLowerCase(),
      password: loginUserRequest.password,
    });

    if (maybeUser === undefined) {
      return NextResponse.json({ success: false, error: 'User does not exist' }, { status: 404 });
    }

    const token = jwt.sign(
      { id: maybeUser.id, email: maybeUser.email, name: maybeUser.firstName },
      jwtSecret,
      {
        expiresIn: '30d',
      },
    );

    return new NextResponse(JSON.stringify({ token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to register:', error);
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
