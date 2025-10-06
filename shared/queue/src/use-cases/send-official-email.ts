import { render } from "@react-email/components";
import { logger } from "../logger";
import * as emailTemplates from "../mail/templates";
import buildQueue from "../lib/buildQueue";
import { type JobType, type OfficialRequest } from "../types";

export default async function sendOfficialEmail({
  officialName,
  email,
  description,
  categoryTopic,
  createdAt,
  files,
}: OfficialRequest): Promise<string | undefined> {
  try {
    logger.info(
      {
        email: email,
      },
      "Creating official email job",
    );

    const officialEmailQueue = buildQueue<JobType.Mail>("official-request");

    const job = await officialEmailQueue.add(
      "official-request",
      {
        to: email,
        subject: "Вместе47. Зарегистрировано новое предложение от жителя",
        text: emailTemplates.officialRequestText({
          officialName,
          description,
          createdAt,
          categoryTopic,
        }),
        html: await render(
          emailTemplates.OfficialRequestEmail({
            officialName,
            description,
            createdAt,
            categoryTopic,
          }),
        ),
        attachments: files,
      },
      {
        priority: 1, // High
      },
    );

    return job.id;
  } catch (error) {
    logger.error({ error, email }, "Error creating official email");
    throw error;
  }
}
