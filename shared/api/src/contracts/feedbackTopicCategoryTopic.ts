import { oc } from "@orpc/contract";
import * as v from "valibot";

const FeedbackTopicCategoryTopicSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  feedback_topic: v.string(),
  feedback_topic_category: v.string(),
});

const CreateFeedbackTopicCategoryTopicSchema = v.object({
  feedback_topic_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  feedback_topic_category_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

const UpdateFeedbackTopicCategoryTopicSchema = v.object({
  body: v.object({
    feedback_topic_id: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
    feedback_topic_category_id: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  }),
  params: v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  }),
});

const GetManyFeedbackTopicCategoryTopicSchema = v.array(FeedbackTopicCategoryTopicSchema);

const feedbackTopicCategoryTopicContract = oc
  .tag("Categories & Topics")
  .prefix("/topic_category_topics")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List topic-category pairs",
        description: "Get topic-category pairs filtered by category id or topic id",
      })
      .input(
        v.optional(
          v.object({
            filter_by: v.union([v.literal("topic"), v.literal("category")]),
            field_id: v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)),
          }),
        ),
      )
      .output(GetManyFeedbackTopicCategoryTopicSchema),

    one: oc
      .route({
        method: "GET",
        path: "/:id",
        summary: "Get one topic-category pair",
      })
      .input(v.object({ id: v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)) }))
      .output(FeedbackTopicCategoryTopicSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create new topic-category link",
      })
      .input(CreateFeedbackTopicCategoryTopicSchema)
      .output(FeedbackTopicCategoryTopicSchema),

    update: oc
      .route({
        method: "PUT",
        path: "/:id",
        summary: "Update a topic-category link",
      })
      .input(UpdateFeedbackTopicCategoryTopicSchema)
      .output(FeedbackTopicCategoryTopicSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/:id",
        summary: "Delete a topic-category link",
      })
      .input(v.object({ id: v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)) }))
      .output(v.object({ success: v.boolean() })),
  });

export default feedbackTopicCategoryTopicContract;
