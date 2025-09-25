import * as v from "valibot";
import { idSchema } from "./base/fields";

const feedbackTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["Пожелание", "Замечание"]),
});

export const getFeedbackTypeSchema = feedbackTypeSchema;
export const getManyFeedbackTypeSchema = v.array(feedbackTypeSchema);

export type FeedbackTypeTable = v.InferOutput<typeof feedbackTypeSchema>;
