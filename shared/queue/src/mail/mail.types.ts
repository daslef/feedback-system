export type MailJobData =
  | {
      to: string;
      subject: string;
      html: string;
      text?: string;
    }
  | {
      to: string;
      subject: string;
      text: string;
    };
