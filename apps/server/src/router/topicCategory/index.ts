import allTopicCategories from "./topicCategory.all";
import createTopicCategory from "./topicCategory.create";

const topicCategoryRouter = {
  all: allTopicCategories,
  create: createTopicCategory,
};

export default topicCategoryRouter;
