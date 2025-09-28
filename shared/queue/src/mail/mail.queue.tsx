import Queue from "../queue";
import { redisClient } from "../redis";
import logger from "../logger";
import * as emailTemplates from "./templates";
import { type JobType } from "../types";

const defaultJobOptions = {
  attempts: 10,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnComplete: {
    age: 24 * 3600,
    count: 1000,
  },
  removeOnFail: {
    age: 7 * 24 * 3600,
  },
};

export default class MailQueue extends Queue<JobType.Mail> {
  constructor() {
    if (!redisClient) {
      throw new Error("Redis client is not ready");
    }

    super("mail", redisClient, defaultJobOptions);
  }

  async sendCitizenEmail(
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

      const job = await this.bullQueue.add(
        approved ? "citizen-approved" : "citizen-rejected",
        {
          to: email,
          subject: "Вместе47. Информация по вашему обращению",
          text: approved
            ? emailTemplates.citizenApprovalText
            : emailTemplates.citizenRejectionText,
          react: approved ? (
            <emailTemplates.CitizenApprovalEmail name={name} />
          ) : (
            <emailTemplates.CitizenRejectionEmail name={name} />
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

  async sendOfficialEmail(
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

      const job = await this.bullQueue.add(
        "official-request",
        {
          to: email,
          subject: "Вместе47. Новое обращение от жителя",
          react: (
            <emailTemplates.OfficialRequestEmail
              message={message}
              name={officialName}
            />
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
}
