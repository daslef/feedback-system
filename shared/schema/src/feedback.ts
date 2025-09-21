import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const dateSchema = v.string();

export const feedbackSchema = v.object({
  id: idSchema,
  project_id: idSchema,
  description: v.string(),
  feedback_type_id: idSchema,
  topic_id: idSchema,
  person_email_contact_id: idSchema,
  feedback_status_id: idSchema,
  created_at: dateSchema,
});

export type FeedbackTable = v.InferInput<typeof feedbackSchema>;
