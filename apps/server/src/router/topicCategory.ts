import { publicProcedure, protectedProcedure } from "@shared/api";

const topicCategoryRouter = {
  all: publicProcedure.topicCategory.all.handler(async ({ context }) => {
    const topicCategories = await context.db
      .selectFrom("topic_category")
      .selectAll()
      .execute();

    return topicCategories;
  }),

  create: publicProcedure.topicCategory.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("topic_category")
          .values(input)
          .executeTakeFirstOrThrow();

        return await context.db
          .selectFrom("topic_category")
          .selectAll()
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch {
        throw new Error("Error on create new topic category");
      }
    },
  ),
};

export default topicCategoryRouter;
