import { LOGO_PNG_URL } from '@/utils/assets';
import {
  Body,
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

type InformationTemplateProps = {
  header: string;
  content: string;
  baseUrl: string;
};

export default function InformationTemplate({
  header,
  content,
  baseUrl,
}: InformationTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{header}</Preview>
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
                {header}
              </Heading>
              <Text className="mb-4 text-base leading-6 text-gray-700">Hello,</Text>
              <Text className="mb-6 text-base leading-6 text-gray-700">{content}</Text>
              <Hr className="my-6 border-gray-200" />
              <Section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <Text className="mb-2 text-sm font-medium leading-5 text-amber-800">
                  🔒 Security Notice
                </Text>
                <Text className="text-sm leading-5 text-amber-700">
                  If you did not initiate this action, please ignore this email. If you have any
                  concerns about your account security, please contact our support team immediately.
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

InformationTemplate.PreviewProps = {
  header: 'Information Email',
  content: 'This is an informational email from El Chat.',
  baseUrl: 'http://127.0.0.1:3000',
};
