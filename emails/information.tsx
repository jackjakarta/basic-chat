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
                {header}
              </Heading>
              <Text className="text-gray-700 text-base leading-6 mb-4">Hello,</Text>
              <Text className="text-gray-700 text-base leading-6 mb-6">{content}</Text>
              <Hr className="border-gray-200 my-6" />
              <Section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <Text className="text-amber-800 text-sm leading-5 mb-2 font-medium">
                  🔒 Security Notice
                </Text>
                <Text className="text-amber-700 text-sm leading-5">
                  If you did not initiate this action, please ignore this email. If you have any
                  concerns about your account security, please contact our support team immediately.
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

InformationTemplate.PreviewProps = {
  header: 'Information Email',
  content: 'This is an informational email from El Chat.',
  baseUrl: 'http://127.0.0.1:3000',
};
