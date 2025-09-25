import { oc } from "@orpc/contract";

import { getManyFeedbackTypeSchema } from "@shared/schema/feedback_type";

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
      .output(getManyFeedbackTypeSchema),
  });

export default feedbackTypeContract;
