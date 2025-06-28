import { sendTestEmail } from '@/email/local';
import VercelInviteUserEmail from '@/emails/vercel-invite-user';
import { checkIsLocalhost } from '@/utils/host';
import { render } from '@react-email/components';
import { NextResponse } from 'next/server';
import React from 'react';

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

  try {
    const emailResult = await sendTestEmail({
      email: 'jack@gmail.com',
      subject: 'Verify your email',
      html: await render(<VercelInviteUserEmail />),
      text: 'Verify your email by clicking the link below.',
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
