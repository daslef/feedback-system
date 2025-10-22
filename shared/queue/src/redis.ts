import { Redis } from "ioredis";
import { env, type Env } from "./env";
import { logger } from "./logger";

interface ClientProps {
  env: Env;
}

async function createRedisClient({ env }: ClientProps) {
  try {
    return new Redis({
      host: env.REDIS_HOST,
      port: Number(env.REDIS_PORT),
      password: env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });
  } catch (error) {
    logger.error(error);
  }
}

export const redisClient = await createRedisClient({ env });

export type RedisClient = Redis;
