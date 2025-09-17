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

  create: publicProcedure.feedbackImage.create.handler(
    async ({ context, input }) => {
      await Promise.all(
        input.files.map(async (file) => {
          console.log(file);
          try {
            const fileUrl = await upload(file, "upload");
            await context.db
              .insertInto("feedback_image")
              .values({
                feedback_id: +input.feedback_id,
                link_to_s3: fileUrl,
              })
              .execute();
          } catch {
            throw new Error("Error on images upload");
          }
        }),
      );
    },
  ),
};

export default feedbackImageRouter;
