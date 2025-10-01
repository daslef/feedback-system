import type { MailJobData } from "./mail/mail.types";

export type OfficialRequest = {
  email: string;
  officialName: string;
  description: string;
  categoryTopic: string | undefined;
  createdAt: string;
  files: string[]
};

export enum JobType {
  Notification = "notification",
  Mail = "mail",
}

export type JobData = {
  [JobType.Notification]: { userId: string; type: string; message: string };
  [JobType.Mail]: MailJobData;
};
