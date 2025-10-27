import buildWorker from "../lib/buildWorker";
import { env } from "../env";
import { mailClient } from "./mail.client";
import { type MailJobData } from "./mail.types";
import { logger } from "../logger";

async function sendMail(options: MailJobData) {
  const { to, subject, text, attachments } = options;

  try {
    return await mailClient?.sendMail({
      from: `"Вместе47" <${env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: "html" in options ? options.html : undefined,
      attachments: attachments?.map((filename) => ({ filename })),
    });
  } catch (error) {
    logger.error("Error on send mail" + error);
  }
}

export default function (queueName: string) {
  logger.info(`mail worker "${queueName}" started`);

  return buildWorker(queueName, async (job) => {
    await sendMail(job.data);
  });
}
