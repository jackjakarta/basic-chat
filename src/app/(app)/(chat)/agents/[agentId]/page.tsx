import PageContainer from '@/components/common/page-container';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  params: z.object({
    agentId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  return (
    <PageContainer className="mx-auto">
      <div className="flex flex-col">
        <h1>
          Your email has been verified. You can now log in to the app using your email and password.
        </h1>
      </div>
    </PageContainer>
  );
}
