import type { Generated, Selectable } from "kysely";

export interface FeedbackStatusTable {
  id: Generated<number>;
  title: "pending" | "approved" | "declined";
}

export type FeedbackStatus = Selectable<FeedbackStatusTable>;
