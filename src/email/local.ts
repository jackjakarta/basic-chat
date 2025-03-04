import nodemailer from 'nodemailer';

export async function sendTestEmail({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    auth: {
      user: 'joke@dsa.com',
      pass: 'dsada',
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
  } catch (error) {
    console.error({ error });
  }
}
