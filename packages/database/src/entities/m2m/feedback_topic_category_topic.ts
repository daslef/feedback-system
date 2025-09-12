import { Generated, Selectable, Updateable, Insertable } from "kysely";

export interface FeedbackTopicCategoryTopicTable {
  id: Generated<number>;
  feedback_topic_id: number;
  feedback_topic_category_id: number;
}

export type FeedbackTopicCategoryTopic =
  Selectable<FeedbackTopicCategoryTopicTable>;
export type NewFeedbackTopicCategoryTopic =
  Insertable<FeedbackTopicCategoryTopicTable>;
export type UpdateFeedbackTopicCategoryTopic =
  Updateable<FeedbackTopicCategoryTopicTable>;
