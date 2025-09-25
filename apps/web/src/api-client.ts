import { createAPIClient } from "@shared/api";

export const apiClient = createAPIClient({
  apiPath: "/api",
  serverUrl: "http://localhost:3000",
});
