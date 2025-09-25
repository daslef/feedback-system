import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const feedbackTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["Пожелание", "Замечание"]),
});

export const getFeedbackTypeSchema = feedbackTypeSchema;
export const getManyFeedbackTypeSchema = v.array(feedbackTypeSchema);

export type FeedbackTypeTable = v.InferInput<typeof feedbackTypeSchema>;
