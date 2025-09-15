import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import feedbackTopicCategoryRouter from "./feedbackTopicCategory";
import feedbackTopicCategoryTopicRouter from './feedbackTopicCategoryTopic'
import feedbackTypeRouter from "./feedbackType";
import feedbackRouter from './feedback'
import personTypeRouter from "./personType";
import contactTypeRouter from "./contactType";
import contactRouter from "./contact";
import personRouter from "./person";

const apiRouter = {
  projects: projectRouter,
  administrativeUnits: administrativeUnitRouter,
  feedbackType: feedbackTypeRouter,
  feedbackTopicCategories: feedbackTopicCategoryRouter,
  feedbackTopicCategoryTopic: feedbackTopicCategoryTopicRouter,
  feedback: feedbackRouter,
  personType: personTypeRouter,
  contactType: contactTypeRouter,
  contact: contactRouter,
  person: personRouter
};

export default apiRouter;
