import type { Generated, Updateable, Selectable } from "kysely";

export interface FeedbackTypeTable {
  id: Generated<number>;
  title: "wish" | "complaint";
}

export type FeedbackType = Selectable<FeedbackTypeTable>;
export type UpdateFeedbackType = Updateable<FeedbackTypeTable>;
