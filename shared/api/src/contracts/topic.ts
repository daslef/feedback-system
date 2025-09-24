import { oc } from "@orpc/contract";

import {
  getTopicSchema,
  getManyTopicsSchema,
  createTopicSchema,
} from "@shared/schema/topic";

const topicContract = oc
  .tag("Categories & Topics")
  .prefix("/topics")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List feedback topics",
        description: "Get information for all feedback topics",
      })
      .output(getManyTopicsSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New feedback topic",
        description: "Create a new feedback topic category",
      })
      .input(createTopicSchema)
      .output(getTopicSchema),
  });

export default topicContract;
