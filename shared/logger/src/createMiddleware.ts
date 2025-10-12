import { pinoHttp } from "pino-http";
import createLogger from "./createLogger";

export const createHttpMiddleware = ({
  env,
}: Parameters<typeof createLogger>[0]) =>
  pinoHttp({
    logger: createLogger({ env, service: "server" }),
    customLogLevel: (_, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 300 && res.statusCode < 400) return "silent";
      return "info";
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        id: req.id,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  });
