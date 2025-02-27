import { getMaybeUserSession } from '@/utils/auth';
import { redirect } from 'next/navigation';

import RegisterForm from './register-form';

export default async function Page() {
  const session = await getMaybeUserSession();

  if (session !== null) {
    redirect('/');
  }

  return <RegisterForm />;
}
