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
                Verify Your Email Address
              </Heading>
              <Text className="text-gray-700 text-base leading-6 mb-4">Hello,</Text>
              <Text className="text-gray-700 text-base leading-6 mb-6">
                Thank you for signing up! To complete your registration and secure your account,
                please verify your email address using the verification code below.
              </Text>
              <Section className="bg-gray-100 rounded-lg p-6 text-center mb-6">
                <Text className="text-sm text-gray-600 mb-2 uppercase tracking-wide font-medium">
                  Your Verification Code
                </Text>
                <Text className="text-3xl font-bold text-gray-900 tracking-widest font-mono">
                  {verificationCode}
                </Text>
              </Section>
              <Text className="text-gray-700 text-base leading-6 mb-6">
                Enter this code in the verification field to activate your account. This code will
                expire in 10 minutes for security purposes.
              </Text>
              <Section className="text-center mb-6">
                <Button
                  href={`${baseUrl}/verify-email`}
                  className="bg-[#494d00] text-[#FFFFFF] px-8 py-3 rounded-lg font-medium text-base"
                >
                  Verify Email Address
                </Button>
              </Section>
              <Text className="text-gray-600 text-sm leading-5 mb-4">
                If you didn't create an account with El Chat, you can safely ignore this email.
              </Text>
              <Hr className="border-gray-200 my-6" />
              <Section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <Text className="text-amber-800 text-sm leading-5 mb-2 font-medium">
                  🔒 Security Notice
                </Text>
                <Text className="text-amber-700 text-sm leading-5">
                  For your security, never share this verification code with anyone. El Chat will
                  never ask for your verification code via phone or email.
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

VerifyEmailTemplate.PreviewProps = {
  verificationCode: 'LJ7G4E',
  baseUrl: 'http://127.0.0.1:3000',
};
