import PageContainer from '@/components/common/page-container';
import { type FileRow } from '@/db/schema';
import { type WithSignedUrl } from '@/types/utils';
import Image from 'next/image';

import DownloadButton from './download-button';
import ShareButton from './share-button';

export default function ImageGrid({ images }: { images: WithSignedUrl<FileRow>[] }) {
  if (images.length === 0) {
    return (
      <PageContainer className="mx-auto">
        <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
          No images found.
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {images.map((image) => (
        <div key={image.id} className="group relative">
          <Image
            src={image.signedUrl}
            alt={image.name}
            className="h-auto w-full cursor-pointer object-cover group-hover:opacity-90"
            loading="lazy"
            width={600}
            height={600}
          />
          <ShareButton
            url={image.signedUrl}
            className="invisible absolute bottom-2 right-2 text-white group-hover:visible dark:text-sidebar-foreground"
          />
          <DownloadButton
            url={image.signedUrl}
            className="invisible absolute bottom-2 right-12 text-white group-hover:visible dark:text-sidebar-foreground"
          />
        </div>
      ))}
    </div>
  );
}
