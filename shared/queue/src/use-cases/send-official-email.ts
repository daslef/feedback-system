import { render } from "@react-email/components";
import logger from "../logger";
import * as emailTemplates from "../mail/templates";
import buildQueue from "../lib/buildQueue";
import { type JobType } from "../types";

export default async function sendOfficialEmail(
  email: string,
  officialName: string,
  message: string,
): Promise<string | undefined> {
  try {
    logger.info(
      {
        email: email,
        message: message,
      },
      "Creating official email job",
    );

    const officialEmailQueue = buildQueue<JobType.Mail>("official-request");

    const job = await officialEmailQueue.add(
      "official-request",
      {
        to: email,
        subject: "Вместе47. Новое обращение от жителя",
        html: await render(
          emailTemplates.OfficialRequestEmail({ message, name: officialName }),
        ),
      },
      {
        priority: 1, // High
      },
    );

    return job.id;
  } catch (error) {
    logger.error({ error, email }, "Error creating welcome email");
    throw error;
  }
}
