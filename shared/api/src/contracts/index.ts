import { oc } from "@orpc/contract";

import projectContract from "./project";
import administrativeUnitContract from "./administrativeUnit";
import feedbackTopicCategoryContract from "./feedbackTopicCategory";
import feedbackTopicCategoryTopicContract from "./feedbackTopicCategoryTopic";

const apiContract = oc
  .errors({
    INPUT_VALIDATION_FAILED: {
      status: 422,
    },
    UNAUTHORIZED: {
      status: 401,
      message: "Missing user session. Please log in!",
    },
    FORBIDDEN: {
      status: 403,
      message: "You do not have enough permission to perform this action.",
    },
  })
  .router({
    project: projectContract,
    administrativeUnit: administrativeUnitContract,
    feedbackTopicCategory: feedbackTopicCategoryContract,
    feedbackTopicCategoryTopic: feedbackTopicCategoryTopicContract
  });

export default apiContract;
