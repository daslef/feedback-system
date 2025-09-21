import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const feedbackImageSchema = v.object({
  id: idSchema,
  feedback_id: idSchema,
  link_to_s3: v.string(),
});

export type FeedbackImageTable = v.InferInput<typeof feedbackImageSchema>;
