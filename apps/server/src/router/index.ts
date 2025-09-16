import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import feedbackTopicCategoryRouter from "./feedbackTopicCategory";
import feedbackTopicCategoryTopicRouter from './feedbackTopicCategoryTopic'
import feedbackTypeRouter from "./feedbackType";
import feedbackRouter from './feedback'
import personTypeRouter from "./personType";
import personContactRouter from "./personContact";
import personRouter from "./person";

const apiRouter = {
  projects: projectRouter,
  administrativeUnits: administrativeUnitRouter,
  feedbackType: feedbackTypeRouter,
  feedbackTopicCategories: feedbackTopicCategoryRouter,
  feedbackTopicCategoryTopic: feedbackTopicCategoryTopicRouter,
  feedback: feedbackRouter,
  personType: personTypeRouter,
  personContact: personContactRouter,
  person: personRouter
};

export default apiRouter;
