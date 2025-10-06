import { Job, Worker, Processor } from "bullmq";
import { redisClient } from "../redis";
import { logger } from "../logger";

const defaultEventHandlers = {
  completed: (job: Job) => {
    logger.info(`Job ${job.name} completed`);
  },
  failed: (job: Job | undefined, error: Error) => {
    logger.info(`Job ${job?.name} failed with <${error.name}>${error.message}`);
  },
  error: (error: Error) => {
    logger.error(error);
  },
};

export default function buildWorker(
  jobName: string,
  handler: Processor,
  eventHandlers = defaultEventHandlers,
) {
  if (!redisClient) {
    throw new Error("Something wrong with Redis client");
  }

  const worker = new Worker(jobName, handler, { connection: redisClient });
  worker.on("completed", eventHandlers.completed);
  worker.on("failed", eventHandlers.failed);
  worker.on("error", eventHandlers.error);

  return worker;
}
