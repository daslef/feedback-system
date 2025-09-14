import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import feedbackTopicCategoryRouter from "./feedbackTopicCategory";
import feedbackTopicCategoryTopicRouter from './feedbackTopicCategoryTopic'

const apiRouter = {
  projects: projectRouter,
  administrativeUnits: administrativeUnitRouter,
  feedbackTopicCategories: feedbackTopicCategoryRouter,
  feedbackTopicCategoryTopic: feedbackTopicCategoryTopicRouter
};

export default apiRouter;
