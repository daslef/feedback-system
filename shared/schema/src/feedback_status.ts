import * as v from "valibot";
import { idSchema } from "./base/fields";

const feedbackStatusSchema = v.object({
  id: idSchema,
  title: v.picklist(["pending", "approved", "declined"]),
});

export const getFeedbackStatusSchema = feedbackStatusSchema;
export const getManyFeedbackStatusSchema = v.array(getFeedbackStatusSchema);

export type FeedbackStatusTable = v.InferOutput<typeof feedbackStatusSchema>;
