export type MailJobData = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: string[];
};
