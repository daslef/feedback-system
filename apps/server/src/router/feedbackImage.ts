import { publicProcedure, protectedProcedure } from "@shared/api"
import upload from "@shared/upload"

const feedbackImageRouter = {
  all: publicProcedure.feedbackImage.all.handler(async ({ context, input }) => {
    const { feedback_id } = input

    const baseQuery = context.db.selectFrom("feedback_image").selectAll()

    if (feedback_id) {
      return await baseQuery
        .where("feedback_image.feedback_id", "=", +feedback_id)
        .execute()
    }

    return await baseQuery.execute()
  }),

  create: publicProcedure.feedbackImage.create.handler(
  async ({ context, input }) => {
    const createdImages = await Promise.all(
      input.files.map(async (file) => {
        const fileUrl = await upload(file, "upload")
        const { insertId } = await context.db
          .insertInto("feedback_image")
          .values({
            feedback_id: +input.feedback_id,
            link_to_s3: fileUrl,
          })
          .executeTakeFirstOrThrow()

        return {
          id: Number(insertId),
          link_to_s3: fileUrl,
          feedback_id: +input.feedback_id,
        }
      }),
    )

    return createdImages
  },
),


  update: publicProcedure.feedbackImage.update.handler(async ({ context, input }) => {
    try {
      await context.db
        .updateTable("feedback_image")
        .set(input.body)
        .where("id", "=", +input.params.id)
        .execute()

      return await context.db
        .selectFrom("feedback_image")
        .selectAll()
        .where("id", "=", +input.params.id)
        .executeTakeFirstOrThrow()
    } catch {
      throw new Error(`Error on update feedback image with ID ${input.params.id}`)
    }
  }),

  one: publicProcedure.feedbackImage.one.handler(async ({ context, input }) => {
    try {
      const image = await context.db
        .selectFrom("feedback_image")
        .selectAll()
        .where("id", "=", +input.id)
        .executeTakeFirstOrThrow()

      return image
    } catch {
      throw new Error(`No such feedback image with ID ${input.id}`)
    }
  }),

  delete: publicProcedure.feedbackImage.delete.handler(async ({ context, input }) => {
    try {
      await context.db
        .deleteFrom("feedback_image")
        .where("id", "=", +input.id)
        .execute()

      return { success: true }
    } catch {
      throw new Error(`Error on delete feedback image with ID ${input.id}`)
    }
  }),
}

export default feedbackImageRouter
