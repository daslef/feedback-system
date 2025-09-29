import { Job, Worker, Processor } from "bullmq";
import { redisClient } from "../redis";

const defaultEventHandlers = {
  completed: (job: Job) => {
    console.log(`Job ${job.name} completed`);
  },
  failed: (job: Job | undefined, error: Error) => {
    console.log(`Job ${job?.name} failed with <${error.name}>${error.message}`);
  },
  error: (error: Error) => {
    console.error(error);
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
