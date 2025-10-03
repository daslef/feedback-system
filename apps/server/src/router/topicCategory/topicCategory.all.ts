import { publicProcedure } from "@shared/api";

const allTopicCategories = publicProcedure.topicCategory.all.handler(
  async ({ context, errors }) => {
    try {
      const topicCategories = await context.db
        .selectFrom("topic_category")
        .selectAll()
        .execute();

      return topicCategories;
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allTopicCategories;
