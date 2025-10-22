import { createAPIClient } from "@shared/api/client";

export const apiClient = createAPIClient({
  apiPath: "/api",
  serverUrl: "http://localhost:3000/",
  // serverUrl: "https://api.xn--47-dlckcacbiv4afwllqms4x.xn--p1ai/",
});
