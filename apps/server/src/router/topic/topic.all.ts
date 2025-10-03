import { publicProcedure } from "@shared/api";

const allTopics = publicProcedure.topic.all.handler(
  async ({ context, errors }) => {
    try {
      const feedbackTopics = await context.db
        .selectFrom("topic")
        .selectAll()
        .execute();

      return feedbackTopics;
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allTopics;
