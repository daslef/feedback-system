import { publicProcedure } from "@shared/api";

const feedbackTypeRouter = {
  all: publicProcedure.feedbackType.all.handler(async ({ context }) => {
    const feedbackTypes = await context.db
      .selectFrom("feedback_type")
      .selectAll()
      .execute();

    return feedbackTypes;
  }),
};

export default feedbackTypeRouter;
