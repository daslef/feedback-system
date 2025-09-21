import { oc } from "@orpc/contract";
import * as v from "valibot";

const TopicSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
});

const GetManyTopicsSchema = v.array(TopicSchema);

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
      .output(GetManyTopicsSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New feedback topic",
        description: "Create a new feedback topic category",
      })
      .input(v.omit(TopicSchema, ["id"]))
      .output(TopicSchema),
  });

export default topicContract;
