import { oc } from "@orpc/contract";
import * as v from "valibot";

const GetFeedbackSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  project_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  project: v.string(),
  description: v.string(),
  feedback_type_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  feedback_type: v.string(),
  feedback_topic_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  feedback_topic: v.string(),
  person_contact_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  feedback_status_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  feedback_status: v.union([
    v.literal("pending"),
    v.literal("approved"),
    v.literal("declined"),
  ]),
  created_at: v.string(),
});

const CreateFeedbackSchema = v.object({
  project_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  description: v.string(),
  feedback_type_id: v.union([v.literal(1), v.literal(2)]),
  feedback_topic_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  person_contact_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

const GetManyFeedbackSchema = v.array(GetFeedbackSchema);

const feedbackContract = oc
  .tag("Feedback")
  .prefix("/feedback")
  .router({
    all: oc
      .input(
        v.object({
          limit: v.exactOptional(
            v.pipe(
              v.union([v.string(), v.number()]),
              v.transform(Number),
              v.number(),
              v.integer(),
              v.minValue(12),
              v.maxValue(48),
            ),
            24,
          ),
          offset: v.exactOptional(
            v.pipe(
              v.union([v.string(), v.number()]),
              v.transform(Number),
              v.number(),
              v.integer(),
            ),
            0,
          ),
        }),
      )
      .route({
        method: "GET",
        path: "/",
        summary: "List all feedback records",
        description: "Get information for all feedback records",
      })
      .output(GetManyFeedbackSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get a feedback record",
        description: "Get full feedback information by id",
      })
      .input(v.object({ id: v.string() }))
      .output(GetFeedbackSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New feedback record",
        description: "Create a new feedback record",
      })
      .input(CreateFeedbackSchema)
      .output(GetFeedbackSchema),
  });

export default feedbackContract;
