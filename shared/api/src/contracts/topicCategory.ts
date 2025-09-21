import { oc } from "@orpc/contract";
import * as v from "valibot";

const TopicCategorySchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
});

const GetManyTopicCategoriesSchema = v.array(TopicCategorySchema);

const topicCategoryContract = oc
  .tag("Categories & Topics")
  .prefix("/topic_categories")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List topic categories",
        description: "Get information for all feedback topic categories",
      })
      .output(GetManyTopicCategoriesSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New topic category",
        description: "Create a new feedback topic category",
      })
      .input(v.omit(TopicCategorySchema, ["id"]))
      .output(TopicCategorySchema),
  });

export default topicCategoryContract;
