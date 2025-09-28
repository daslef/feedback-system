import type { MailJobData } from "./mail/mail.types";

export enum JobType {
  Notification = "notification",
  Mail = "mail",
}

export type JobData = {
  [JobType.Notification]: { userId: string; type: string; message: string };
  [JobType.Mail]: MailJobData;
};
