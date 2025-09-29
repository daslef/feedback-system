import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import administrativeUnitTypeRouter from "./administrativeUnitType";
import topicRouter from "./topic";
import topicCategoryRouter from "./topicCategory";
import topicCategoryTopicRouter from "./topicCategoryTopic";
import feedbackTypeRouter from "./feedbackType";
import feedbackRouter from "./feedback";
import personTypeRouter from "./personType";
import personRouter from "./person";
import officialResponsibilityRouter from "./officialResponsibility";

const apiRouter = {
  projects: projectRouter,
  administrativeUnits: administrativeUnitRouter,
  administrativeUnitTypes: administrativeUnitTypeRouter,
  feedbackType: feedbackTypeRouter,
  topic: topicRouter,
  topicCategories: topicCategoryRouter,
  topicCategoryTopic: topicCategoryTopicRouter,
  feedback: feedbackRouter,
  person: personRouter,
  personType: personTypeRouter,
  officialResponsibility: officialResponsibilityRouter,
};

export default apiRouter;
