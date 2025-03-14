import { UICard } from '@/components/common/container-card';
import { getUser } from '@/utils/auth';

import ChangePasswordForm from './change-password-form';
import ProfileForm from './profile-form';

const uiCardClassName = 'bg-muted/30 border-muted/50 pt-4 px-2';

export default async function Page() {
  const user = await getUser();

  return (
    <>
      <UICard className={uiCardClassName}>
        <ProfileForm {...user} />
      </UICard>
      <UICard className={uiCardClassName}>
        <ChangePasswordForm />
      </UICard>
    </>
  );
}
