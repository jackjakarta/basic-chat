import { getMaybeUserSession } from '@/utils/auth';
import { redirect } from 'next/navigation';

import { LoginForm } from './login-form';

export default async function Page() {
  const session = await getMaybeUserSession();

  if (session !== null) {
    redirect('/');
  }

  return <LoginForm />;
}
