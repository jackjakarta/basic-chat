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

type VerifyEmailProps = {
  verificationCode: string;
  baseUrl: string;
};

export default function VerifyEmailTemplate({ verificationCode, baseUrl }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code: {verificationCode}</Preview>
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
                Verify Your Email Address
              </Heading>
              <Text className="mb-4 text-base leading-6 text-gray-700">Hello,</Text>
              <Text className="mb-6 text-base leading-6 text-gray-700">
                Thank you for signing up! To complete your registration and secure your account,
                please verify your email address using the verification code below.
              </Text>
              <Section className="mb-6 rounded-lg bg-gray-100 p-6 text-center">
                <Text className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-600">
                  Your Verification Code
                </Text>
                <Text className="font-mono text-3xl font-bold tracking-widest text-gray-900">
                  {verificationCode}
                </Text>
              </Section>
              <Text className="mb-6 text-base leading-6 text-gray-700">
                Enter this code in the verification field to activate your account. This code will
                expire in 10 minutes for security purposes.
              </Text>
              <Section className="mb-6 text-center">
                <Button
                  href={`${baseUrl}/verify-email`}
                  className="rounded-lg bg-[#494d00] px-8 py-3 text-base font-medium text-[#FFFFFF]"
                >
                  Verify Email Address
                </Button>
              </Section>
              <Text className="mb-4 text-sm leading-5 text-gray-600">
                If you didn't create an account with El Chat, you can safely ignore this email.
              </Text>
              <Hr className="my-6 border-gray-200" />
              <Section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <Text className="mb-2 text-sm font-medium leading-5 text-amber-800">
                  🔒 Security Notice
                </Text>
                <Text className="text-sm leading-5 text-amber-700">
                  For your security, never share this verification code with anyone. El Chat will
                  never ask for your verification code via phone or email.
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

VerifyEmailTemplate.PreviewProps = {
  verificationCode: 'LJ7G4E',
  baseUrl: 'http://127.0.0.1:3000',
};
