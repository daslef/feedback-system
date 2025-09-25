import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const dateSchema = v.string();

const feedbackSchema = v.object({
  id: idSchema,
  project_id: idSchema,
  description: v.string(),
  feedback_type_id: idSchema,
  topic_id: v.nullable(idSchema),
  person_email_contact_id: idSchema,
  feedback_status_id: idSchema,
  created_at: dateSchema,
});

export const getFeedbackSchema = v.object({
  ...feedbackSchema.entries,
  topic: v.string(),
  project: v.string(),
  feedback_type: v.string(),
  feedback_status: v.picklist(["pending", "approved", "declined"]),
});

export const getManyFeedbackSchema = v.array(getFeedbackSchema);

export const createFeedbackSchema = v.object({
  project_id: idSchema,
  description: v.string(),
  feedback_type_id: idSchema,
  topic_id: v.nullable(idSchema),
  first_name: v.string(),
  last_name: v.string(),
  middle_name: v.string(),
  person_type_id: idSchema,
  email: v.string(),
  phone: v.optional(v.string()),
  social: v.optional(v.string()),
});

export type FeedbackTable = v.InferInput<typeof feedbackSchema>;
