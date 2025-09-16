import type { Generated, Insertable, Updateable, Selectable } from "kysely";

export interface FeedbackTable {
  id: Generated<number>;
  project_id: number;
  description: string;
  feedback_type_id: number;
  feedback_topic_id: number;
  person_email_contact_id: number;
  feedback_status_id: number;
  created_at: Generated<string>;
}

export type Feedback = Selectable<FeedbackTable>;
export type NewFeedback = Insertable<FeedbackTable>;
export type UpdateFeedback = Updateable<FeedbackTable>;
