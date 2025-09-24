import { publicProcedure, protectedProcedure } from "@shared/api";

const topicCategoryRouter = {
  all: publicProcedure.topicCategory.all.handler(
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
  ),

  create: protectedProcedure.topicCategory.create.handler(
    async ({ context, input, errors }) => {
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
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании новой категории",
        });
      }
    },
  ),
};

export default topicCategoryRouter;
