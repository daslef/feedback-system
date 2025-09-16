import { oc } from "@orpc/contract";
import * as v from "valibot";

const FeedbackTopicCategorySchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
});

const GetManyFeedbackTopicCategoriesSchema = v.array(
  FeedbackTopicCategorySchema,
);

const feedbackTopicCategoryContract = oc
  .tag("Categories & Topics")
  .prefix("/topic_categories")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all topic categories",
        description: "Get information for all feedback topic categories",
      })
      .output(GetManyFeedbackTopicCategoriesSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New topic category",
        description: "Create a new feedback topic category",
      })
      .input(v.omit(FeedbackTopicCategorySchema, ["id"]))
      .output(FeedbackTopicCategorySchema),
  });

export default feedbackTopicCategoryContract;
