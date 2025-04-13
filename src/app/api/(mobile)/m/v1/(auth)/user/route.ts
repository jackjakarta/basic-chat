import { dbGetUserById } from '@/db/functions/user';
import { obscureUser } from '@/utils/user';
import { NextResponse } from 'next/server';

import { getUserFromHeaders } from '../../utils';

export async function GET(req: Request) {
  try {
    const decryptedToken = getUserFromHeaders(req.headers);
    const user = await dbGetUserById({ userId: decryptedToken.id });

    if (user === undefined) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const obscuredUser = obscureUser(user);

    return NextResponse.json({ user: obscuredUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
