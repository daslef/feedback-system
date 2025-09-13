import urlJoin from 'url-join';
import * as v from 'valibot';

import { onError, ORPCError } from '@orpc/client';
import { ValidationError } from '@orpc/contract';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins';
import { StrictGetMethodPlugin } from '@orpc/server/plugins';
import { experimental_ValibotToJsonSchemaConverter as ValibotToJsonSchemaConverter } from '@orpc/valibot';

import type { AuthInstance } from '@shared/auth';
import { db as dbInstance } from '@shared/database';
import { createORPCContext } from './context';

export const createApi = ({
  appRouter,
  auth,
  db,
  serverUrl,
  apiPath,
}: {
  appRouter: any;
  auth: AuthInstance;
  db: typeof dbInstance;
  serverUrl: string;
  apiPath: `/${string}`;
}) => {
  const handler = new OpenAPIHandler(appRouter, {
    plugins: [
      new StrictGetMethodPlugin(),
      new OpenAPIReferencePlugin({
        docsTitle: 'Feedback System | API Reference',
        docsProvider: 'scalar',
        schemaConverters: [new ValibotToJsonSchemaConverter()],
        specGenerateOptions: {
          info: {
            title: 'Feedback System API',
            version: '1.0.0',
          },
          servers: [{ url: urlJoin(serverUrl, apiPath) }],
        },
      }),
    ],
    clientInterceptors: [
      onError((error) => {
        if (
          error instanceof ORPCError &&
          error.code === 'BAD_REQUEST' &&
          error.cause instanceof ValidationError
        ) {
          const valiIssues = error.cause.issues as [
            v.BaseIssue<unknown>,
            ...v.BaseIssue<unknown>[],
          ];
          console.error(v.flatten(valiIssues));
          throw new ORPCError('INPUT_VALIDATION_FAILED', {
            status: 422,
            message: v.summarize(valiIssues),
            cause: error.cause,
          });
        }
      }),
    ],
  });
  return {
    handler: async (request: Request) => {
      return handler.handle(request, {
        prefix: apiPath,
        context: await createORPCContext({
          db,
          auth,
          headers: request.headers,
        }),
      });
    },
  };
};
