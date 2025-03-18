import { authOptions } from '@/app/api/auth/[...nextauth]/utils';
import { dbGetUserById } from '@/db/functions/user';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function getValidSession() {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect('/login');
  }

  return session;
}

export async function getMaybeUserSession() {
  return await getServerSession(authOptions);
}

export async function getUser() {
  const session = await getValidSession();
  const user = await dbGetUserById({ userId: session.user.id });

  if (user === undefined) {
    redirect('/login');
  }

  if (!user.emailVerified) {
    redirect('/verify-email');
  }

  return user;
}

export async function getMaybeUser() {
  const session = await getMaybeUserSession();

  if (session === null) {
    return undefined;
  }

  const user = await dbGetUserById({ userId: session.user.id });

  return user;
}
