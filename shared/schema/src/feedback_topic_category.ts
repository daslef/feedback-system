import * as v from "valibot";

export const feedbackTopicCategorySchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
});

export type FeedbackTopicCategoryTable = v.InferInput<
  typeof feedbackTopicCategorySchema
>;
