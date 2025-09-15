import { oc } from "@orpc/contract";

import projectContract from "./project";
import administrativeUnitContract from "./administrativeUnit";
import feedbackTopicCategoryContract from "./feedbackTopicCategory";
import feedbackTopicCategoryTopicContract from "./feedbackTopicCategoryTopic";
import feedbackTypeContract from "./feedbackType";
import feedbackContract from "./feedback";
import contactTypeContract from "./contactType";
import personTypeContract from "./personType";
import personContract from "./person";
import contactContract from "./contact";

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
    feedbackType: feedbackTypeContract,
    feedbackTopicCategory: feedbackTopicCategoryContract,
    feedbackTopicCategoryTopic: feedbackTopicCategoryTopicContract,
    feedback: feedbackContract,
    contactType: contactTypeContract,
    personType: personTypeContract,
    person: personContract,
    contact: contactContract
  });

export default apiContract;
