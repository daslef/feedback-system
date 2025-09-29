import buildWorker from "src/lib/buildWorker";
import { env } from "../env";
import { mailClient } from "./mail.client";
import { type MailJobData } from "./mail.types";

async function sendMail(options: MailJobData) {
  const { to, subject, text } = options;

  return await mailClient?.sendMail({
    from: `"Вместе47" <${env.SMTP_USER}>`,
    to,
    subject,
    text,
    html: "html" in options ? options.html : undefined,
  });
}

export default function (queueName: string) {
  console.log(`mail worker "${queueName}" started`);

  return buildWorker(queueName, async (job) => {
    await sendMail(job.data);
  });
}
