import { sendTestEmail } from '@/email/local';
import VerifyEmailTemplate from '@/emails/verify-email';
import { checkIsLocalhost } from '@/utils/host';
import { render } from '@react-email/components';
import { NextResponse } from 'next/server';

export async function GET() {
  const isLocalHost = checkIsLocalhost();

  if (!isLocalHost) {
    return NextResponse.json(
      { success: false, error: 'This endpoint is only available in development' },
      { status: 403 },
    );
  }

  try {
    const [html, text] = await Promise.all([
      render(<VerifyEmailTemplate baseUrl="http://127.0.0.1:3000" verificationCode="G4RY8L" />),
      render(<VerifyEmailTemplate baseUrl="http://127.0.0.1:3000" verificationCode="G4RY8L" />, {
        plainText: true,
      }),
    ]);

    const emailResult = await sendTestEmail({
      email: 'jack@gmail.com',
      subject: 'Verify your email',
      text,
      html,
    });

    if (emailResult !== undefined && !emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to send test email' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: 'Test email sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error({ error });

    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 },
    );
  }
}
