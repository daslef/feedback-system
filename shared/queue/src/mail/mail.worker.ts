import "server-only";
import { render } from "@react-email/components";

import { env } from "../env";
import { mailClient } from "./mail.client";
import { type MailJobData } from "./mail.types";

export async function sendMail(options: MailJobData) {
  const { to, subject, text } = options;

  return await mailClient?.sendMail({
    from: `"Вместе47" <${env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: "react" in options ? await render(options.react) : undefined,
  });
}
