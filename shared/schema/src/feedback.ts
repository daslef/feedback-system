// TODO: rewrite as valibot schema

export interface FeedbackTable {
  id: number;
  project_id: number;
  description: string;
  feedback_type_id: number;
  feedback_topic_id: number;
  person_email_contact_id: number;
  feedback_status_id: number;
  created_at: string;
}
