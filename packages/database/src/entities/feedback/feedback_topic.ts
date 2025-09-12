import type { Generated, Insertable, Updateable, Selectable } from "kysely";

export interface FeedbackTopicTable {
  id: Generated<number>;
  title: string;
}

export type FeedbackTopic = Selectable<FeedbackTopicTable>;
export type NewFeedbackTopic = Insertable<FeedbackTopicTable>;
export type UpdateFeedbackTopic = Updateable<FeedbackTopicTable>;
