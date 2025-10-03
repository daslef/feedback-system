import allFeedback from "./feedback.all";
import createFeedback from "./feedback.create";
import oneFeedback from "./feedback.one";
import updateFeedback from "./feedback.update";

const feedbackRouter = {
  all: allFeedback,
  one: oneFeedback,
  update: updateFeedback,
  create: createFeedback,
};

export default feedbackRouter;
