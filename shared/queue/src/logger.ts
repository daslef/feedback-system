import { createLogger } from "@shared/logger";
export const logger = createLogger({ env: "production", service: "queue" });
