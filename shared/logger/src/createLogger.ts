import pino, { type LoggerOptions } from "pino";
import createTransport from "./transport";

type Env = {
  env: "development" | "production" | "test";
  service: "admin" | "server" | "web" | "auth" | "queue" | "upload";
  serializers?: LoggerOptions["serializers"];
};

export default function createLogger<
  T extends "error" | "warn" | "info" | "silent",
>({ env, service, serializers }: Env) {
  const isDevelopment = env === "development";
  const isTest = env === "test";

  const baseLogger = pino<T, false>({
    transport: createTransport({ isDevelopment, service }),
    enabled: !isTest,
    formatters: {
      bindings: (bindings) => ({
        pid: bindings.pid,
        hostname: bindings.hostname,
        env,
      }),
    },
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
  });

  return baseLogger.child({ service });
}
