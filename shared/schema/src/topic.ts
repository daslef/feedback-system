import * as v from "valibot";

const topicSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
});

export const getTopicSchema = topicSchema;
export const createTopicSchema = v.omit(topicSchema, ["id"]);
export const getManyTopicsSchema = v.array(getTopicSchema);

export type TopicTable = v.InferInput<typeof topicSchema>;
