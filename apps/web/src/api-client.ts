import { createAPIClient } from "@shared/api";

export const apiClient = createAPIClient({
  apiPath: "/api",
  serverUrl: "http://localhost:3000",
});

export type ApiClient = typeof apiClient
