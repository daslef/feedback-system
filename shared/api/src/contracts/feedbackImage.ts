import { oc } from "@orpc/contract";
import * as v from "valibot";

const FeedbackImageSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  link_to_s3: v.pipe(v.string(), v.url()),
  feedback_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

const GetManyFeedbackImageSchema = v.array(FeedbackImageSchema);

const CreateFeedbackImageSchema = v.object({
  feedback_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  files: v.array(
    v.pipe(
      v.file(),
      v.mimeType(["image/*"], "Пожалуйста, выберите файл с изображением"),
      v.maxSize(1024 * 1024 * 30, "Максимальный размер файла 30 MB."),
    ),
  ),
});

const UpdateFeedbackImageSchema = v.object({
  link_to_s3: v.optional(v.pipe(v.string(), v.url())),
  feedback_id: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
});

const FeedbackImageContract = oc
  .tag("FeedbackImage")
  .prefix("/feedback_image")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all feedback images",
        description: "Get all feedback images or filter by feedback_id",
      })
      .input(
        v.object({
          feedback_id: v.optional(
            v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
          ),
          offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
          limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
        }),
      )
      .output(GetManyFeedbackImageSchema),

    one: oc
      .route({
        method: "GET",
        path: "/:id",
        summary: "Get one feedback image",
        description: "Get a single feedback image by its ID",
      })
      .input(
        v.object({
          id: v.pipe(v.number(), v.integer(), v.minValue(1)),
        }),
      )
      .output(FeedbackImageSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create new feedback images",
        description: "Upload and link images to a feedback record",
      })
      .input(CreateFeedbackImageSchema)
      .output(GetManyFeedbackImageSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/:id",
        summary: "Update feedback image",
        description: "Update fields of an existing feedback image",
      })
      .input(
        v.object({
          params: v.object({
            id: v.pipe(v.number(), v.integer(), v.minValue(1)),
          }),
          body: UpdateFeedbackImageSchema,
        }),
      )
      .output(FeedbackImageSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/:id",
        summary: "Delete feedback image",
        description: "Delete a feedback image by ID",
      })
      .input(
        v.object({
          id: v.pipe(v.number(), v.integer(), v.minValue(1)),
        }),
      )
      .output(v.object({ success: v.boolean() })),
  });

export default FeedbackImageContract;
