import { toErrorMessage } from '@/utils/error';
import nodemailer from 'nodemailer';

import { type EmailActionResult } from './types';

export async function sendTestEmail({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}): Promise<EmailActionResult | undefined> {
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    auth: {
      user: 'jack@gmail.com',
      pass: 'hdsa2gh1uih',
    },
  });

  const mailOptions = {
    from: 'info@klikr.app',
    to: email,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.debug({ info });
    return { success: true };
  } catch (error) {
    console.error({ error });
    return { success: false, error: toErrorMessage(error) };
  }
}
