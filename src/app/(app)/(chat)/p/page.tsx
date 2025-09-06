import Header from '@/components/common/header';
import PageContainer from '@/components/common/page-container';

import ChatProjectsDisplay from './chat-projects-display';
import CreateNewProjectDialog from './create-new-project-dialog';

export default function Page() {
  return (
    <>
      <Header />
      <PageContainer className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize your AI conversations with custom projects and system prompts.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <CreateNewProjectDialog />
          <ChatProjectsDisplay />
        </div>
      </PageContainer>
    </>
  );
}
