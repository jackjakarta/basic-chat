import { UICard } from '@/components/common/ui-card';
import { getUser } from '@/utils/auth';
import { uiCardClassName } from '@/utils/tailwind';

import ChangePasswordForm from './change-password-form';
import ProfileForm from './profile-form';

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
      {user.passwordHash && (
        <UICard
          header={<h1 className="text-lg">Change your password</h1>}
          className={uiCardClassName}
        >
          <ChangePasswordForm />
        </UICard>
      )}
      <div className="mb-16" />
    </>
  );
}
