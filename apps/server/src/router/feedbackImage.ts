import { publicProcedure, protectedProcedure } from "@shared/api";
import upload from "@shared/upload";

const feedbackImageRouter = {
  all: publicProcedure.feedbackImage.all.handler(async ({ context, input }) => {
    const { feedback_id } = input;

    const baseQuery = context.db.selectFrom("feedback_image").selectAll();

    if (feedback_id) {
      return await baseQuery
        .where("feedback_image.feedback_id", "=", +feedback_id)
        .execute();
    }

    return await baseQuery.execute();
  }),
};

export default feedbackImageRouter;
