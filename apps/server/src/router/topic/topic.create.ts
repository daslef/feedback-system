import { protectedProcedure } from "@shared/api";

const createTopic = protectedProcedure.topic.create.handler(
  async ({ context, input, errors }) => {
    try {
      let topicId;

      if (context.environment === "development") {
        const { insertId } = await context.db
          .insertInto("topic")
          .values(input)
          .executeTakeFirstOrThrow();
        topicId = insertId;
      } else {
        const { id } = await context.db
          .insertInto("topic")
          .values(input)
          .returning("id")
          .executeTakeFirstOrThrow();
        topicId = id;
      }

      return await context.db
        .selectFrom("topic")
        .selectAll()
        .where("topic.id", "=", Number(topicId))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: "Ошибка при создании нового топика",
      });
    }
  },
);

export default createTopic;
