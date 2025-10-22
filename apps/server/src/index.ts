import { serve } from "@hono/node-server";
import { createLogger } from "@shared/logger";
import { env } from "./env";
import createApp from "./bootstrap";

const logger = createLogger({ env: env.ENV })

const server = serve(
  {
    fetch: createApp(env).fetch,
    port: 3001,
  },
  (_) => {
    console.log(`
Hono
- internal server url: http://localhost:3001
- external server url: ${env.PUBLIC_SERVER_URL}
- api reference: ${env.PUBLIC_SERVER_URL}/api
- api reference (auth): ${env.PUBLIC_SERVER_URL}/api/auth/reference
    `);
  },
);

const shutdown = () => {
  server.close((error) => {
    if (error) {
      logger.error(error)
    } else {
      logger.info("\nServer has stopped gracefully.");
    }
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
