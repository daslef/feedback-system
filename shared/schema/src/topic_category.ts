import * as v from "valibot";

const topicCategorySchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
});

export const getTopicCategorySchema = topicCategorySchema;
export const getManyTopicCategoriesSchema = v.array(getTopicCategorySchema);
export const createTopicCategorySchema = v.omit(getTopicCategorySchema, ["id"]);

export type TopicCategoryTable = v.InferInput<typeof topicCategorySchema>;
