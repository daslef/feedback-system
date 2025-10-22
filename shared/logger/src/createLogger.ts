import pino, { type LoggerOptions } from "pino";
import pretty from 'pino-pretty'

type Env = {
  env: "development" | "production" | "staging" | "test";
  serializers?: LoggerOptions["serializers"];
};

export default function createLogger<
  T extends "error" | "warn" | "info" | "silent",
>({ env, serializers }: Env) {
  const isDevelopment = env === "development";
  const isTest = env === "test";

  const stream = pretty({
    levelFirst: true,
    colorize: true,
    ignore: "pid",
    translateTime: "dd.mm.yyyy HH:MM:ss"
  });

  const baseLogger = pino<T, false>({
    level: isDevelopment ? "debug" : "info",
    enabled: !isTest,
    serializers,
    redact: {
      paths: [
        "password",
        "token",
        "apiKey",
        "ssn",
        "*.password",
        "*.token",
        "req.headers.authorization",
        "req.headers.cookie",
      ],
      remove: true,
    },
  }, stream);

  return baseLogger;
}
