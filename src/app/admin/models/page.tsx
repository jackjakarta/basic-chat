import PageContainer from '@/components/common/page-container';
import { dbGetAllTextModels } from '@/db/functions/ai-model';

import ModelsTable from './models-table';

export default async function Page() {
  const models = await dbGetAllTextModels();

  return (
    <PageContainer className="mx-auto w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Model Management</h1>
        <ModelsTable models={models} />
      </div>
    </PageContainer>
  );
}
