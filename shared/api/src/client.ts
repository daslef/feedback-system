import { createORPCClient } from "@orpc/client";
import { ResponseValidationPlugin } from "@orpc/contract/plugins";
import { OpenAPILink } from "@orpc/openapi-client/fetch";

import type {
  ContractRouterClient,
  InferContractRouterOutputs,
} from "@orpc/contract";

import apiContract from "./contracts";

interface APIClientOptions {
  serverUrl: string;
  apiPath: `/${string}`;
}

export type RouterOutput = InferContractRouterOutputs<typeof apiContract>;

export const createAPIClient = ({ serverUrl, apiPath }: APIClientOptions) => {
  const link = new OpenAPILink(apiContract, {
    url: serverUrl + apiPath,
    plugins: [new ResponseValidationPlugin(apiContract)],
    fetch: (request, init) => {
      return globalThis.fetch(request, {
        ...init,
        credentials: "include",
      });
    },
  });

  const client: ContractRouterClient<typeof apiContract> =
    createORPCClient(link);

  return client;
};
