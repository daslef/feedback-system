import { oc } from "@orpc/contract";
import * as v from "valibot";

const GetFeedbackTopicCategoryTopicSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  feedback_topic: v.string(),
  feedback_topic_category: v.string(),
});

const GetManyFeedbackTopicCategoryTopicSchema = v.array(
  GetFeedbackTopicCategoryTopicSchema,
);

const feedbackTopicCategoryTopicContract = oc
  .tag("Categories & Topics")
  .prefix("/topic_category_topics")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List topic-categories pairs",
        description:
          "Get topic-categories pairs filtered by category id or topic id",
      })
      .input(
        v.optional(
          v.object({
            filter_by: v.union([v.literal("topic"), v.literal("category")]),
            field_id: v.pipe(
              v.string(),
              v.transform(Number),
              v.number(),
              v.integer(),
              v.minValue(1),
            ),
          }),
        ),
      )
      .output(GetManyFeedbackTopicCategoryTopicSchema),
  });

export default feedbackTopicCategoryTopicContract;
