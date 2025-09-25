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

    one: oc
      .route({
        method: "GET",
        path: "/:id",
        summary: "Get one topic category",
        description: "Retrieve a single feedback topic category by ID",
      })
      .input(
        v.object({
          id: v.pipe(v.number(), v.integer(), v.minValue(1)),
        }),
      )
      .output(FeedbackTopicCategorySchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New topic category",
        description: "Create a new feedback topic category",
      })
      .input(v.omit(FeedbackTopicCategorySchema, ["id"]))
      .output(FeedbackTopicCategorySchema),

    update: oc
      .route({
        method: "PUT",
        path: "/:id",
        summary: "Update topic category",
        description: "Update an existing feedback topic category",
      })
      .input(
        v.object({
          params: v.object({
            id: v.pipe(v.number(), v.integer(), v.minValue(1)),
          }),
          body: v.omit(FeedbackTopicCategorySchema, ["id"]),
        }),
      )
      .output(FeedbackTopicCategorySchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/:id",
        summary: "Delete topic category",
        description: "Delete a feedback topic category by ID",
      })
      .input(
        v.object({
          id: v.pipe(v.number(), v.integer(), v.minValue(1)),
        }),
      )
      .output(
        v.object({
          success: v.boolean(),
        }),
      ),
  });

export default feedbackTopicCategoryContract;
