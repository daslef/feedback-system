import type { Generated, Insertable, Updateable, Selectable } from "kysely";

export interface FeedbackTable {
  id: Generated<number>;
  project_id: number;
  description: string;
  person_contact_id: number;
  created_at: string;
  feedback_status_id: number;
}

export type Feedback = Selectable<FeedbackTable>;
export type NewFeedback = Insertable<FeedbackTable>;
export type UpdateFeedback = Updateable<FeedbackTable>;
