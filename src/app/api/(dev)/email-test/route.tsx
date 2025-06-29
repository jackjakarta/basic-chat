import { sendTestEmail } from '@/email/local';
import VerifyEmailTemplate from '@/emails/verify-email';
import { checkIsLocalhost, getBaseUrlByHeaders } from '@/utils/host';
import { render } from '@react-email/components';
import { NextResponse } from 'next/server';

export async function GET() {
  const isLocalHost = checkIsLocalhost();

  if (!isLocalHost) {
    return NextResponse.json(
      {
        success: false,
        error: 'This endpoint is only available in development',
      },
      { status: 403 },
    );
  }

  const baseUrl = getBaseUrlByHeaders();

  try {
    const html = await render(<VerifyEmailTemplate baseUrl={baseUrl} verificationCode="G4RY8L" />);

    const emailResult = await sendTestEmail({
      email: 'jack@gmail.com',
      subject: 'Verify your email',
      text: 'This email is not supported by your email client.',
      html,
    });

    if (emailResult !== undefined && !emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to send test email',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Test email sent successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error({ error });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test email',
      },
      { status: 500 },
    );
  }
}
