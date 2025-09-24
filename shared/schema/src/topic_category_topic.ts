import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const topicCategoryTopicSchema = v.object({
  id: idSchema,
  topic_id: idSchema,
  topic_category_id: idSchema,
});

export const getTopicCategoryTopicSchema = v.object({
  id: idSchema,
  topic: v.string(),
  topic_category: v.string(),
});

export const getManyTopicCategoryTopicSchema = v.array(
  getTopicCategoryTopicSchema,
);

export const createTopicCategoryTopicSchema = v.object({
  topic_id: idSchema,
  topic_category_id: idSchema,
});

export type TopicCategoryTopicTable = v.InferInput<
  typeof topicCategoryTopicSchema
>;
