export type InformationEmailMetadata =
  | {
      type: 'email-verified-success';
    }
  | {
      type: 'reset-password-success';
    }
  | {
      type: 'account-delete-success';
    };

export type MailTemplateResult = {
  success: true;
  subject: string;
  mailTemplate: string;
  createdAt: Date;
};

export type MailTemplateError = {
  success: false;
  error: string;
};

export type MailTemplateResponse = MailTemplateResult | MailTemplateError;

export type EmailActionResult = {
  success: boolean;
  messageId?: string;
  error?: string;
  createdAt?: Date;
};

export type InformationEmailType = InformationEmailMetadata['type'];
