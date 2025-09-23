import { oc } from "@orpc/contract";
import * as v from "valibot";

const FeedbackImageSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  link_to_s3: v.pipe(v.string(), v.url()),
  feedback_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

const GetManyFeedbackImageSchema = v.array(FeedbackImageSchema);

const feedbackImageContract = oc
  .tag("Feedback")
  .prefix("/feedback_image")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all feedback images",
        description:
          "Get information for all feedback images or filter by feedback_id",
      })
      .input(
        v.object({
          feedback_id: v.optional(
            v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
          ),
        }),
      )
      .output(GetManyFeedbackImageSchema),
  });

export default feedbackImageContract;
