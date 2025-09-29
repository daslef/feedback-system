import { publicProcedure } from "@shared/api";

const feedbackStatusRouter = {
  all: publicProcedure.feedbackStatus.all.handler(async ({ context }) => {
    const feedbackStatuses = await context.db
      .selectFrom("feedback_status")
      .selectAll()
      .execute();

    return feedbackStatuses;
  }),
};

export default feedbackStatusRouter;
