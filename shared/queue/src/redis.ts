import { Redis } from "ioredis";
import { env, type Env } from "./env";

interface ClientProps {
  env: Env;
}

async function createRedisClient({ env }: ClientProps) {
  try {
    return new Redis({
      host: "127.0.0.1",
      port: Number(env.REDIS_PORT),
      password: env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });
  } catch (error) {
    console.error(error);
  }
}

export const redisClient = await createRedisClient({ env });

export type RedisClient = Redis;
