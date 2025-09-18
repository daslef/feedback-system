import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const feedbackTopicCategoryTopicSchema = v.object({
  id: idSchema,
  feedback_topic_id: idSchema,
  feedback_topic_category_id: idSchema,
});

export type FeedbackTopicCategoryTopicTable = v.InferInput<
  typeof feedbackTopicCategoryTopicSchema
>;
