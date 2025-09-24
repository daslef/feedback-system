import { oc } from "@orpc/contract";

import {
  getTopicCategorySchema,
  getManyTopicCategoriesSchema,
  createTopicCategorySchema,
} from "@shared/schema/topic_category";

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
      .output(getManyTopicCategoriesSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New topic category",
        description: "Create a new feedback topic category",
      })
      .input(createTopicCategorySchema)
      .output(getTopicCategorySchema),
  });

export default topicCategoryContract;
