import { oc } from "@orpc/contract";

import { getManyFeedbackStatusSchema } from "@shared/schema/feedback_status";

const feedbackStatusContract = oc
  .tag("Feedback")
  .prefix("/feedback_statuses")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all feedback statuses",
        description: "Get information for all feedback statuses",
      })
      .output(getManyFeedbackStatusSchema),
  });

export default feedbackStatusContract;
