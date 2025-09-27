import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import administrativeUnitTypeRouter from "./administrativeUnitType";
import topicRouter from "./topic";
import topicCategoryRouter from "./topicCategory";
import topicCategoryTopicRouter from "./topicCategoryTopic";
import feedbackTypeRouter from "./feedbackType";
import feedbackStatusRouter from "./feedbackStatus";
import feedbackRouter from "./feedback";
import personTypeRouter from "./personType";
import personRouter from "./person";

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
};

export default apiRouter;
