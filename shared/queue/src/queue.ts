import {
  Queue as BullQueue,
  QueueEvents as BullQueueEvents,
  JobsOptions,
} from "bullmq";

import logger from "./logger";
import { type RedisClient } from "./redis";
import { JobType, JobData } from "./types";

export default class Queue<J extends JobType> {
  public bullQueue: BullQueue<JobData[J]>;
  private events: BullQueueEvents;
  private queueName: string;

  constructor(
    queueName: string,
    redisInstance: RedisClient,
    jobOptions: JobsOptions,
  ) {
    this.queueName = queueName;
    this.bullQueue = new BullQueue<JobData[J]>(queueName, {
      connection: redisInstance,
      defaultJobOptions: jobOptions,
    });
    this.events = new BullQueueEvents(queueName);
    this.addEventHandlers();
  }

  addEventHandlers() {
    this.bullQueue.on("error", (error) => {
      logger.error({ error }, "Email queue error");
    });

    this.bullQueue.on("waiting", (jobId) => {
      logger.debug({ jobId }, `${this.queueName} job waiting`);
    });

    // this.events.on("failed", (job: J, error) => {
    //   logger.error(
    //     {
    //       jobId: job?.id,
    //       attempts: job?.attemptsMade,
    //       error,
    //     },
    //     `Email job failed: ${error.message}`,
    //   );
    // });

    // this.bullQueue.on("completed", (job) => {
    //   logger.info(
    //     {
    //       jobId: job?.id,
    //       to: job?.data.to,
    //       subject: job?.data.subject,
    //     },
    //     "Email job completed",
    //   );
    // });

    // this.bullQueue.on("stalled", (jobId) => {
    //   logger.warn({ jobId }, "Email job stalled");
    // });

    // this.bullQueue.on("active", (job) => {
    //   logger.debug(
    //     {
    //       jobId: job?.id,
    //       to: job?.data.to,
    //     },
    //     "Email job active",
    //   );
    // });
  }
}
