import * as v from "valibot";

export const topicCategorySchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
});

export type TopicCategoryTable = v.InferInput<typeof topicCategorySchema>;
