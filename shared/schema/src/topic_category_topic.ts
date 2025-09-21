import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const topicCategoryTopicSchema = v.object({
  id: idSchema,
  topic_id: idSchema,
  topic_category_id: idSchema,
});

export type TopicCategoryTopicTable = v.InferInput<
  typeof topicCategoryTopicSchema
>;
