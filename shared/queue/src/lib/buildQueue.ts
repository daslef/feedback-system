import { Queue } from "bullmq";
import { redisClient } from "../redis";
import { type JobType, type JobData } from "../types";

const defaultJobOptions = {
  attempts: 50,
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

export default <J extends JobType>(queueName: string) => {
  if (!redisClient) {
    throw new Error("Something wrong with Redis client");
  }

  return new Queue<JobData[J]>(queueName, {
    connection: redisClient,
    defaultJobOptions,
  });
};
