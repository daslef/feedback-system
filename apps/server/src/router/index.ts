import projectRouter from "./project";
import administrativeUnitRouter from "./administrativeUnit";
import topicRouter from "./topic";
import topicCategoryRouter from "./topicCategory";
import topicCategoryTopicRouter from "./topicCategoryTopic";
import feedbackTypeRouter from "./feedbackType";
import feedbackImageRouter from "./feedbackImage";
import feedbackRouter from "./feedback";
import personTypeRouter from "./personType";
import personRouter from "./person";

const apiRouter = {
  projects: projectRouter,
  administrativeUnits: administrativeUnitRouter,
  feedbackType: feedbackTypeRouter,
  topic: topicRouter,
  topicCategories: topicCategoryRouter,
  topicCategoryTopic: topicCategoryTopicRouter,
  feedbackImage: feedbackImageRouter,
  feedback: feedbackRouter,
  person: personRouter,
  personType: personTypeRouter,
};

export default apiRouter;
