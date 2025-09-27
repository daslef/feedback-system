import * as v from "valibot";
import { oc } from "@orpc/contract";

import {
  getFeedbackSchema,
  getManyFeedbackSchema,
  createFeedbackSchema,
  updateFeedbackSchema,
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

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New feedback record",
        description: "Create a new feedback record",
        inputStructure: "detailed",
        spec: (spec) => ({
          ...spec,
          operationId: "feedback.create",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    project_id: {
                      type: "number",
                    },
                    description: {
                      type: "string",
                    },
                    topic_category_topic_id: {
                      type: "number",
                    },
                    feedback_type_id: {
                      type: "number",
                    },
                    first_name: {
                      type: "string",
                    },
                    last_name: {
                      type: "string",
                    },
                    middle_name: {
                      type: "string",
                    },
                    email: {
                      type: "string",
                    },
                    phone: {
                      type: "string",
                    },
                    files: {
                      type: "array",
                      items: {
                        type: "string",
                        contentMediaType: "image/*",
                      },
                    },
                  },
                  required: [
                    "project_id",
                    "description",
                    "topic_category_topic_id",
                    "feedback_type_id",
                    "first_name",
                    "last_name",
                    "middle_name",
                    "email",
                  ],
                },
              },
            },
          },
        }),
      })
      .input(
        v.object({
          body: createFeedbackSchema,
        }),
      ),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Update feedback record",
        description: "Update feedback record (topic, status, project)",
      })
      .input(updateFeedbackSchema)
      .output(getFeedbackSchema),
  });

export default feedbackContract;
