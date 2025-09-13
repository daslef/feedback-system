
import { serve } from '@hono/node-server';
import { env } from './env';
import createApp from "./bootstrap";

const server = serve(
  {
    fetch: createApp().fetch,
    port: env.SERVER_PORT,
    hostname: env.SERVER_HOST,
  },
  (info) => {
    const host = info.address;
    console.log(`
Hono
- internal server url: http://${host}:${info.port}
- external server url: ${env.PUBLIC_SERVER_URL}
- public web url: ${env.PUBLIC_WEB_URL}
- api reference: ${env.PUBLIC_SERVER_URL}/api
- api reference (auth): ${env.PUBLIC_SERVER_URL}/api/auth/reference
    `);
  },
);

const shutdown = () => {
  server.close((error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('\nServer has stopped gracefully.');
    }
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);