import * as v from "valibot";
import { idSchema } from "./base/fields";

const topicSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
});

export const getTopicSchema = topicSchema;
export const createTopicSchema = v.omit(topicSchema, ["id"]);
export const getManyTopicsSchema = v.array(getTopicSchema);

export type TopicTable = v.InferOutput<typeof topicSchema>;
