import { UICard } from '@/components/common/ui-card';
import { getUser } from '@/utils/auth';
import { cw, uiCardClassName } from '@/utils/tailwind';

import ChangePasswordForm from './change-password-form';
import DeleteAllChatsButton from './delete-all-chats-button';
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
      <UICard
        header={<h1 className="text-lg">Delete all chats</h1>}
        className={cw(uiCardClassName, 'pb-6')}
      >
        <DeleteAllChatsButton />
        <div className="mt-3">
          <span className="text-sm dark:text-muted-foreground/60">
            This action will delete all your conversations and cannot be undone.
          </span>
        </div>
      </UICard>
      <div className="mb-16" />
    </>
  );
}
