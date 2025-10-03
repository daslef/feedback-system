import { protectedProcedure } from "@shared/api";

const createTopicCategory = protectedProcedure.topicCategory.create.handler(
  async ({ context, input, errors }) => {
    try {
      let topicCategoryId;

      if (context.environment === "development") {
        const { insertId } = await context.db
          .insertInto("topic_category")
          .values(input)
          .executeTakeFirstOrThrow();
        topicCategoryId = insertId;
      } else {
        const { id } = await context.db
          .insertInto("topic_category")
          .values(input)
          .returning("id")
          .executeTakeFirstOrThrow();
        topicCategoryId = id;
      }

      return await context.db
        .selectFrom("topic_category")
        .selectAll()
        .where("topic_category.id", "=", Number(topicCategoryId))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: "Ошибка при создании новой категории",
      });
    }
  },
);

export default createTopicCategory;
