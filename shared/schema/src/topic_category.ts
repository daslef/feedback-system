import * as v from "valibot";
import { idSchema } from "./base/fields";

const topicCategorySchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
});

export const getTopicCategorySchema = topicCategorySchema;
export const getManyTopicCategoriesSchema = v.array(getTopicCategorySchema);
export const createTopicCategorySchema = v.omit(getTopicCategorySchema, ["id"]);

export type TopicCategoryTable = v.InferOutput<typeof topicCategorySchema>;
