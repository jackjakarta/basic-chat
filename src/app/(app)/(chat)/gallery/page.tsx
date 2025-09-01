import { dbGetGeneratedImagesByUserId } from '@/db/functions/file';
import { getSignedUrlFromS3Get } from '@/s3';
import { getUser } from '@/utils/auth';

import ImageGrid from './image-grid';

export default async function Page() {
  const user = await getUser();
  const images = await dbGetGeneratedImagesByUserId({ userId: user.id, userEmail: user.email });

  if (images.length === 0) {
    return <ImageGrid images={[]} />;
  }

  const imagesWithSignedUrls = await Promise.all(
    images.map(async (image) => {
      const signedUrl = await getSignedUrlFromS3Get({
        key: image.s3BucketKey,
        filename: image.name,
        attachment: true,
      });

      return { ...image, signedUrl };
    }),
  );

  return (
    <div className="min-h-screen w-full">
      <ImageGrid images={imagesWithSignedUrls} />
    </div>
  );
}
