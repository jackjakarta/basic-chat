import { getMaybeUser } from '@/utils/auth';
import { redirect } from 'next/navigation';

import VerifyCodeForm from './verify-code-form';

export default async function Page() {
  const user = await getMaybeUser();

  if (user === undefined) {
    redirect('/login');
  }

  if (user.emailVerified) {
    redirect('/');
  }

  return <VerifyCodeForm email={user.email} />;
}
