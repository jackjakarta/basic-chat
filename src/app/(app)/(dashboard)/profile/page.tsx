import PageContainer from '@/components/common/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUser } from '@/utils/auth';
import { getUserAvatarUrl } from '@/utils/user';

export default async function Page() {
  const user = await getUser();
  const avatarUrl = getUserAvatarUrl({ email: user.email });

  return (
    <PageContainer className="mx-auto">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={user.email} />
            <AvatarFallback className="bg-transparent border border-accent" />
          </Avatar>
          <h1 className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <p>Edit your profile information, including your name, email, and password.</p>
      </div>
    </PageContainer>
  );
}
