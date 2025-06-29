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
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            <Section className="bg-white rounded-t-lg px-8 py-6">
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
              <Heading className="text-2xl font-bold text-[#494d00] text-center mb-6">
                Reset Your Password
              </Heading>
              <Text className="text-gray-700 text-base leading-6 mb-4">Hello,</Text>
              <Text className="text-gray-700 text-base leading-6 mb-6">
                We received a request to reset your password. If you didn't make this request, you
                can safely ignore this email.
              </Text>
              <Text className="text-gray-700 text-base leading-6 mb-6">
                To reset your password, click the button below. This link will expire in 10 minutes
                for security purposes.
              </Text>
              <Section className="text-center mb-6">
                <Button
                  href={actionUrl}
                  className="bg-[#494d00] text-white px-8 py-3 rounded-lg font-medium text-base"
                >
                  Reset Password
                </Button>
              </Section>
              <Text className="text-gray-600 text-sm leading-5 mb-4">
                If you didn't request a password reset, no action is required.
              </Text>
              <Hr className="border-gray-200 my-6" />
              <Section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <Text className="text-amber-800 text-sm leading-5 mb-2 font-medium">
                  🔒 Security Notice
                </Text>
                <Text className="text-amber-700 text-sm leading-5">
                  For your security, this password reset link can only be used once. El Chat will
                  never ask for your password via phone or email.
                </Text>
              </Section>
            </Section>
            <Section className="bg-gray-100 rounded-b-lg px-8 py-6">
              <Text className="text-gray-600 text-sm text-center leading-5 mb-2">
                This email was sent by El Chat
              </Text>
              <Row className="text-center">
                <Column>
                  <Text className="text-gray-500 text-xs">
                    <Link
                      href={`${baseUrl}/privacy-policy`}
                      className="text-gray-600 hover:underline mr-4"
                    >
                      Privacy Policy
                    </Link>
                    <Link href={`${baseUrl}/terms`} className="text-gray-600 hover:underline mr-4">
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
