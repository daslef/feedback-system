import { oc } from "@orpc/contract";

import projectContract from "./project";
import administrativeUnitContract from "./administrativeUnit";
import topicContract from "./topic";
import topicCategoryContract from "./topicCategory";
import topicCategoryTopicContract from "./topicCategoryTopic";
import feedbackTypeContract from "./feedbackType";
import feedbackImageContract from "./feedbackImage";
import feedbackContract from "./feedback";
import personTypeContract from "./personType";
import personContract from "./person";
import personContactContract from "./personContact";

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
    feedbackImage: feedbackImageContract,
    topic: topicContract,
    topicCategory: topicCategoryContract,
    topicCategoryTopic: topicCategoryTopicContract,
    feedback: feedbackContract,
    personType: personTypeContract,
    person: personContract,
    personContact: personContactContract,
  });

export default apiContract;
