import { LOGO_PNG_URL } from '@/utils/assets';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type ForgotPasswordProps = {
  actionUrl: string;
  baseUrl: string;
};

export default function ForgotPasswordTemplate({ actionUrl, baseUrl }: ForgotPasswordProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-2xl px-4 py-8">
            <Section className="rounded-t-lg bg-white px-8 py-6">
              <Row>
                <Column>
                  <Img
                    src={LOGO_PNG_URL}
                    width="40"
                    height="40"
                    alt={'El Chat'}
                    className="mx-auto"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="bg-white px-8 py-6">
              <Heading className="mb-6 text-center text-2xl font-bold text-[#494d00]">
                Reset Your Password
              </Heading>
              <Text className="mb-4 text-base leading-6 text-gray-700">Hello,</Text>
              <Text className="mb-6 text-base leading-6 text-gray-700">
                We received a request to reset your password. If you didn't make this request, you
                can safely ignore this email.
              </Text>
              <Text className="mb-6 text-base leading-6 text-gray-700">
                To reset your password, click the button below. This link will expire in 10 minutes
                for security purposes.
              </Text>
              <Section className="mb-6 text-center">
                <Button
                  href={actionUrl}
                  className="rounded-lg bg-[#494d00] px-8 py-3 text-base font-medium text-white"
                >
                  Reset Password
                </Button>
              </Section>
              <Text className="mb-4 text-sm leading-5 text-gray-600">
                If you didn't request a password reset, no action is required.
              </Text>
              <Hr className="my-6 border-gray-200" />
              <Section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <Text className="mb-2 text-sm font-medium leading-5 text-amber-800">
                  🔒 Security Notice
                </Text>
                <Text className="text-sm leading-5 text-amber-700">
                  For your security, this password reset link can only be used once. El Chat will
                  never ask for your password via phone or email.
                </Text>
              </Section>
            </Section>
            <Section className="rounded-b-lg bg-gray-100 px-8 py-6">
              <Text className="mb-2 text-center text-sm leading-5 text-gray-600">
                This email was sent by El Chat
              </Text>
              <Row className="text-center">
                <Column>
                  <Text className="text-xs text-gray-500">
                    <Link
                      href={`${baseUrl}/privacy-policy`}
                      className="mr-4 text-gray-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    <Link href={`${baseUrl}/terms`} className="mr-4 text-gray-600 hover:underline">
                      Terms of Service
                    </Link>
                    <Link href={`${baseUrl}/contact`} className="text-gray-600 hover:underline">
                      Contact Support
                    </Link>
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ForgotPasswordTemplate.PreviewProps = {
  actionUrl: 'http://127.0.0.1:3000/reset-password?token=example-token',
  baseUrl: 'http://127.0.0.1:3000',
};
