import { publicProcedure, protectedProcedure } from "@shared/api";

const topicRouter = {
  all: publicProcedure.topic.all.handler(async ({ context }) => {
    const feedbackTopics = await context.db
      .selectFrom("topic")
      .selectAll()
      .execute();

    return feedbackTopics;
  }),

  create: publicProcedure.topic.create.handler(async ({ context, input }) => {
    try {
      const { insertId } = await context.db
        .insertInto("topic")
        .values(input)
        .executeTakeFirstOrThrow();

      return await context.db
        .selectFrom("topic")
        .selectAll()
        .where("id", "=", Number(insertId))
        .executeTakeFirstOrThrow();
    } catch {
      throw new Error("Error on create new feedback topic");
    }
  }),
};

export default topicRouter;
