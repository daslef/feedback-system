import { publicProcedure, protectedProcedure } from "@shared/api";

const feedbackTopicCategoryRouter = {
  all: publicProcedure.feedbackTopicCategory.all.handler(
    async ({ context }) => {
      const feedbackTopicCategories = await context.db
        .selectFrom("feedback_topic_category")
        .selectAll()
        .execute();

      return feedbackTopicCategories;
    },
  ),

  create: protectedProcedure.feedbackTopicCategory.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("feedback_topic_category")
          .values(input)
          .executeTakeFirstOrThrow();

        return await context.db
          .selectFrom("feedback_topic_category")
          .selectAll()
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch {
        throw new Error("Error on create new administrative unit");
      }
    },
  ),
};

export default feedbackTopicCategoryRouter;
