import * as v from "valibot";

export const feedbackTopicSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
});

export type FeedbackTopicTable = v.InferInput<typeof feedbackTopicSchema>;
