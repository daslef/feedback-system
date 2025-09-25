import { publicProcedure, protectedProcedure } from "@shared/api"

const feedbackTopicCategoryRouter = {
  all: publicProcedure.feedbackTopicCategory.all.handler(
    async ({ context }) => {
      const feedbackTopicCategories = await context.db
        .selectFrom("feedback_topic_category")
        .selectAll()
        .execute()

      return feedbackTopicCategories
    },
  ),

  one: publicProcedure.feedbackTopicCategory.one.handler(
    async ({ context, input }) => {
      try {
        const category = await context.db
          .selectFrom("feedback_topic_category")
          .selectAll()
          .where("id", "=", +input.id)
          .executeTakeFirstOrThrow()

        return category
      } catch {
        throw new Error(`No feedback topic category with ID ${input.id}`)
      }
    },
  ),

  create: protectedProcedure.feedbackTopicCategory.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("feedback_topic_category")
          .values(input)
          .executeTakeFirstOrThrow()

        return await context.db
          .selectFrom("feedback_topic_category")
          .selectAll()
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow()
      } catch {
        throw new Error("Error on create new feedback topic category")
      }
    },
  ),

  update: protectedProcedure.feedbackTopicCategory.update.handler(
    async ({ context, input }) => {
      try {
        await context.db
          .updateTable("feedback_topic_category")
          .set(input.body)
          .where("id", "=", +input.params.id)
          .execute()

        return await context.db
          .selectFrom("feedback_topic_category")
          .selectAll()
          .where("id", "=", +input.params.id)
          .executeTakeFirstOrThrow()
      } catch {
        throw new Error(`Error on update feedback topic category with ID ${input.params.id}`)
      }
    },
  ),

  delete: protectedProcedure.feedbackTopicCategory.delete.handler(
    async ({ context, input }) => {
      try {
        await context.db
          .deleteFrom("feedback_topic_category")
          .where("id", "=", +input.id)
          .execute()

        return { success: true }
      } catch {
        throw new Error(`Error on delete feedback topic category with ID ${input.id}`)
      }
    },
  ),
}

export default feedbackTopicCategoryRouter
