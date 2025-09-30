import { oc } from "@orpc/contract";
import * as v from "valibot";

import {
  getTopicCategoryTopicSchema,
  getManyTopicCategoryTopicSchema,
  createTopicCategoryTopicSchema,
} from "@shared/schema/topic_category_topic";

import { baseInputAll } from "@shared/schema/base";

const topicCategoryTopicContract = oc
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
      .input(baseInputAll)
      .output(getManyTopicCategoryTopicSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create topic-category pair",
        description:
          "Create topic-categories pair by assign category_id and topic_id",
      })
      .input(createTopicCategoryTopicSchema)
      .output(getTopicCategoryTopicSchema),
  });

export default topicCategoryTopicContract;
