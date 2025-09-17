import { join } from "path";
import pino from "pino";

const file = join(__dirname, "..", "..", "logs", `logs-${process.pid}.json`);

const logger = pino({
  transport: {
    targets: [
      {
        level: "warn",
        target: "pino/file",
        options: {
          destination: file,
        },
      },
      {
        level: "error",
        target: "pino/file",
        options: {
          destination: file,
        },
      },
      {
        level: "info",
        target: "pino-pretty",
      },
    ],
  },
});

export default logger;
