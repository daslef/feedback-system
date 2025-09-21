import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const feedbackTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["Пожелание", "Замечание"]),
});

export type FeedbackTypeTable = v.InferInput<typeof feedbackTypeSchema>;
