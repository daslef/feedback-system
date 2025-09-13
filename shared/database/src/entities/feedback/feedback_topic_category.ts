import type { Generated, Insertable, Updateable, Selectable } from "kysely";

export interface FeedbackTopicCategoryTable {
  id: Generated<number>;
  title: string;
}

export type FeedbackTopicCategory = Selectable<FeedbackTopicCategoryTable>;
export type NewFeedbackTopicCategory = Insertable<FeedbackTopicCategoryTable>;
export type UpdateFeedbackTopicCategory =
  Updateable<FeedbackTopicCategoryTable>;
