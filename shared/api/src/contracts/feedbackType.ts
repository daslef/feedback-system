import { oc } from "@orpc/contract";
import * as v from "valibot";

const FeedbackTypeSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
});

const GetManyFeedbackTypeSchema = v.array(FeedbackTypeSchema);

const feedbackTypeContract = oc
  .tag("Feedback")
  .prefix("/feedback_types")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all feedback types",
        description: "Get information for all feedback types",
      })
      .output(GetManyFeedbackTypeSchema),
  });

export default feedbackTypeContract;
