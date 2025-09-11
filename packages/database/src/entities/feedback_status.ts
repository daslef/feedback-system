import type { Generated, Selectable } from "kysely";

export interface FeedbackStatusTable {
  id: Generated<number>;
  status: "pending" | "approved" | "declined";
}

export type FeedbackStatus = Selectable<FeedbackStatusTable>;
