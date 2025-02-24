import PageContainer from '@/components/common/page-container';

export default function TokenVerifyFail() {
  return (
    <PageContainer className="mx-auto">
      <h1>
        This link appears to contain a token that is broken or invalid. Please request a new one.
      </h1>
    </PageContainer>
  );
}
