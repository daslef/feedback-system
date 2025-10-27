import { OpenAPIHandler } from "@orpc/openapi/fetch";
import {
  StrictGetMethodPlugin,
  ResponseHeadersPlugin,
} from "@orpc/server/plugins";

import type { AuthInstance } from "@shared/auth";
import { db as dbInstance } from "@shared/database";
import { createORPCContext, onErrorInterceptor, onError } from "@shared/api";

type CreateApi = {
  apiRouter: any;
  auth: AuthInstance;
  db: typeof dbInstance;
  environment: "production" | "staging" | "development";
  apiPath: `/${string}`;
};

export const createApi = ({
  apiRouter,
  auth,
  db,
  environment,
  apiPath,
}: CreateApi) => {
  const handler = new OpenAPIHandler(apiRouter, {
    plugins: [new ResponseHeadersPlugin(), new StrictGetMethodPlugin()],
    clientInterceptors: [onError(onErrorInterceptor)],
  });
  return {
    handler: async (request: Request) => {
      return handler.handle(request, {
        prefix: apiPath,
        context: await createORPCContext({
          db,
          auth,
          environment,
          headers: request.headers,
        }),
      });
    },
  };
};
