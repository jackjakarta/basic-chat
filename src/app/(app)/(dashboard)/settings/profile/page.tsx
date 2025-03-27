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
        <ProfileForm
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          customInstructions={user.settings?.customInstructions}
        />
      </UICard>
      <UICard
        header={<h1 className="text-lg">Change your password</h1>}
        className={uiCardClassName}
      >
        <ChangePasswordForm />
      </UICard>
    </>
  );
}
