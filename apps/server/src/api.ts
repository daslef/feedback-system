import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import {
  StrictGetMethodPlugin,
  ResponseHeadersPlugin,
} from "@orpc/server/plugins";

import type { AuthInstance } from "@shared/auth";
import { db as dbInstance } from "@shared/database";
import {
  createORPCContext,
  onErrorInterceptor,
  ValibotToJsonSchemaConverter,
  onError,
} from "@shared/api";

type CreateApi = {
  apiRouter: any;
  auth: AuthInstance;
  db: typeof dbInstance;
  environment: "production" | "development";
  serverUrl: string;
  apiPath: `/${string}`;
};

export const createApi = ({
  apiRouter,
  auth,
  db,
  environment,
  serverUrl,
  apiPath,
}: CreateApi) => {
  const handler = new OpenAPIHandler(apiRouter, {
    plugins: [
      new ResponseHeadersPlugin(),
      new StrictGetMethodPlugin(),
      new OpenAPIReferencePlugin({
        docsTitle: "Feedback System | API Reference",
        docsProvider: "scalar",
        schemaConverters: [new ValibotToJsonSchemaConverter()],
        specGenerateOptions: {
          info: {
            title: "Feedback System API",
            version: "1.0.0",
          },
          servers: [{ url: serverUrl + apiPath }],
        },
      }),
    ],
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
