import { Generated, Selectable, Insertable } from "kysely";

export interface FeedbackImageTable {
  id: Generated<number>;
  feedback_id: number;
  link_to_s3: string;
}

export type FeedbackImage = Selectable<FeedbackImageTable>;
export type NewFeedbackImage = Insertable<FeedbackImage>;
