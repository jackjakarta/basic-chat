import { dbGetFolderAndFiles } from '@/db/functions/folder';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import UploadToFolderButton from './upload-to-folder-button';

const pageContextSchema = z.object({
  params: z.object({
    folderId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const { folderId } = parsedParams.data.params;
  const folderAndFiles = await dbGetFolderAndFiles({ folderId, userId: user.id });

  if (folderAndFiles === undefined) {
    return notFound();
  }

  return (
    <div>
      <h1>{folderAndFiles.name}</h1>
      <UploadToFolderButton folderId={folderAndFiles.id} />
    </div>
  );
}
