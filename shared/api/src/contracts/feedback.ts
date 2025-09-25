import { oc } from "@orpc/contract";

import {
  getFeedbackSchema,
  getManyFeedbackSchema,
  createFeedbackSchema,
} from "@shared/schema/feedback";

import { baseInputAll, baseInputOne } from "@shared/schema/base";

const feedbackContract = oc
  .tag("Feedback")
  .prefix("/feedback")
  .router({
    all: oc
      .input(baseInputAll)
      .route({
        method: "GET",
        path: "/",
        summary: "List all feedback records",
        description: "Get information for all feedback records",
      })
      .output(getManyFeedbackSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get a feedback record",
        description: "Get full feedback information by id",
      })
      .input(baseInputOne)
      .output(getFeedbackSchema),

    // create: oc
    //   .route({
    //     method: "POST",
    //     path: "/",
    //     summary: "New feedback record",
    //     description: "Create a new feedback record",
    //   })
    //   .input(createFeedbackSchema)
    //   .output(getFeedbackSchema),
  });

export default feedbackContract;
