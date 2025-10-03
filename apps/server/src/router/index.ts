import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import topicRouter from "./topic";
import topicCategoryRouter from "./topicCategory";
import topicCategoryTopicRouter from "./topicCategoryTopic";
import feedbackRouter from "./feedback";
import personRouter from "./person";
import officialResponsibilityRouter from "./officialResponsibility";

import feedbackTypeRouter from "./enumerations/feedbackType";
import administrativeUnitTypeRouter from "./enumerations/administrativeUnitType";
import feedbackStatusRouter from "./enumerations/feedbackStatus";
import personTypeRouter from "./enumerations/personType";

const apiRouter = {
  projects: projectRouter,
  administrativeUnits: administrativeUnitRouter,
  administrativeUnitTypes: administrativeUnitTypeRouter,
  feedbackType: feedbackTypeRouter,
  feedback_statuses: feedbackStatusRouter,
  topic: topicRouter,
  topicCategories: topicCategoryRouter,
  topicCategoryTopic: topicCategoryTopicRouter,
  feedback: feedbackRouter,
  person: personRouter,
  personType: personTypeRouter,
  officialResponsibility: officialResponsibilityRouter,
};

export default apiRouter;
