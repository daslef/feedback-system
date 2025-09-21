import { oc } from "@orpc/contract";
import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const GetTopicCategoryTopicSchema = v.object({
  id: idSchema,
  topic: v.string(),
  topic_category: v.string(),
});

const GetManyTopicCategoryTopicSchema = v.array(GetTopicCategoryTopicSchema);

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
      .input(
        v.object({
          filter: v.optional(
            v.union([
              v.pipe(
                v.string(),
                v.transform((s) => decodeURI(s).split("&")),
                v.array(v.string()),
              ),
              v.array(
                v.pipe(
                  v.string(),
                  v.transform((s) => decodeURI(s)),
                ),
              ),
            ]),
          ),
          filter_by: v.optional(v.picklist(["topic", "category"])),
          field_id: v.optional(
            v.pipe(
              v.string(),
              v.transform(Number),
              v.number(),
              v.integer(),
              v.minValue(1),
            ),
          ),
        }),
      )
      .output(GetManyTopicCategoryTopicSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create topic-category pair",
        description:
          "Create topic-categories pair by assign category_id and topic_id",
      })
      .input(
        v.object({
          topic_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
          topic_category_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
        }),
      )
      .output(GetTopicCategoryTopicSchema),
  });

export default topicCategoryTopicContract;
