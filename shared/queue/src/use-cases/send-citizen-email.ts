import { render } from "@react-email/components";
import logger from "../logger";
import * as emailTemplates from "../mail/templates";
import buildQueue from "../lib/buildQueue";
import { type JobType } from "../types";

export default async function sendCitizenEmail(
  email: string,
  name: string,
  approved: boolean,
): Promise<string | undefined> {
  try {
    logger.info(
      {
        email: email,
        name: name,
      },
      "Creating citizen email job",
    );

    const citizenApprovedEmailQueue =
      buildQueue<JobType.Mail>("citizen-approved");
    const citizenRejectedEmailQueue =
      buildQueue<JobType.Mail>("citizen-rejected");

    if (approved) {
      const job = await citizenApprovedEmailQueue.add(
        "citizen-approved",
        {
          to: "daslef93@gmail.com",
          subject: "Вместе47. Информация по вашему обращению",
          text: emailTemplates.citizenApprovalText,
          html: await render(emailTemplates.CitizenApprovalEmail({ name })),
        },
        {
          priority: 1,
        },
      );
      return job.id;
    }

    const job = await citizenRejectedEmailQueue.add(
      "citizen-rejected",
      {
        to: email,
        subject: "Вместе47. Информация по вашему обращению",
        text: emailTemplates.citizenRejectionText,
        html: await render(emailTemplates.CitizenRejectionEmail({ name })),
      },
      {
        priority: 1,
      },
    );

    return job.id;
  } catch (error) {
    logger.error({ error, email }, "Error creating welcome email");
    throw error;
  }
}
