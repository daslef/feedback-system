import { publicProcedure } from "@shared/api";

const feedbackTopicCategoryTopicRouter = {
  all: publicProcedure.feedbackTopicCategoryTopic.all.handler(
    async ({ context, input }) => {
      const query = context.db
        .selectFrom("feedback_topic_category_topic")
        .innerJoin(
          "feedback_topic",
          "feedback_topic.id",
          "feedback_topic_category_topic.feedback_topic_id",
        )
        .innerJoin(
          "feedback_topic_category",
          "feedback_topic_category.id",
          "feedback_topic_category_topic.feedback_topic_category_id",
        )
        .select([
          "feedback_topic_category_topic.id",
          "feedback_topic.title as feedback_topic",
          "feedback_topic_category.title as feedback_topic_category",
        ]);

      if (!input) {
        return await query.execute();
      }

      const { filter_by, field_id } = input;

      const whereCondition =
        filter_by === "category"
          ? "feedback_topic_category_topic.feedback_topic_category_id"
          : "feedback_topic_category_topic.feedback_topic_id";

      return await query.where(whereCondition, "=", +field_id).execute();
    },
  ),
};

export default feedbackTopicCategoryTopicRouter;
