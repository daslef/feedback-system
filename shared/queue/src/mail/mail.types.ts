import type { ReactElement } from "react";

export type MailJobData =
  | {
      to: string;
      subject: string;
      react: ReactElement;
      text?: string;
    }
  | {
      to: string;
      subject: string;
      text: string;
    };
