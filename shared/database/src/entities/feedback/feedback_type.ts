import type { Generated, Updateable, Selectable } from "kysely";

export interface FeedbackTypeTable {
  id: Generated<number>;
  title: "Пожелание" | "Замечание";
}

export type FeedbackType = Selectable<FeedbackTypeTable>;
export type UpdateFeedbackType = Updateable<FeedbackTypeTable>;
