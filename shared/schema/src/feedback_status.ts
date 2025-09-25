import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const feedbackStatusSchema = v.object({
  id: idSchema,
  title: v.picklist(["pending", "approved", "declined"]),
});

export const getFeedbackStatusSchema = feedbackStatusSchema;
export const getManyFeedbackStatusSchema = v.array(getFeedbackStatusSchema);

export type FeedbackStatusTable = v.InferInput<typeof feedbackStatusSchema>;
