import PageContainer from '@/components/common/page-container';

export default function Page() {
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
