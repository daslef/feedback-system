import { publicProcedure, protectedProcedure } from "@shared/api"

const feedbackTopicCategoryTopicRouter = {
  all: publicProcedure.feedbackTopicCategoryTopic.all.handler(
    async ({ context, input }) => {
      const query = context.db
        .selectFrom("feedback_topic_category_topic")
        .innerJoin(
          "feedback_topic",
          "feedback_topic.id",
          "feedback_topic_category_topic.feedback_topic_id",
        )
        .innerJoin(
          "feedback_topic_category",
          "feedback_topic_category.id",
          "feedback_topic_category_topic.feedback_topic_category_id",
        )
        .select([
          "feedback_topic_category_topic.id",
          "feedback_topic.title as feedback_topic",
          "feedback_topic_category.title as feedback_topic_category",
        ])

      if (!input) {
        return await query.execute()
      }

      const { filter_by, field_id } = input
      const whereCondition =
        filter_by === "category"
          ? "feedback_topic_category_topic.feedback_topic_category_id"
          : "feedback_topic_category_topic.feedback_topic_id"

      return await query.where(whereCondition, "=", +field_id).execute()
    },
  ),

  one: publicProcedure.feedbackTopicCategoryTopic.one.handler(
    async ({ context, input }) => {
      try {
        const topicLink = await context.db
          .selectFrom("feedback_topic_category_topic")
          .innerJoin(
            "feedback_topic",
            "feedback_topic.id",
            "feedback_topic_category_topic.feedback_topic_id",
          )
          .innerJoin(
            "feedback_topic_category",
            "feedback_topic_category.id",
            "feedback_topic_category_topic.feedback_topic_category_id",
          )
          .select([
            "feedback_topic_category_topic.id",
            "feedback_topic.title as feedback_topic",
            "feedback_topic_category.title as feedback_topic_category",
          ])
          .where("feedback_topic_category_topic.id", "=", +input.id)
          .executeTakeFirstOrThrow()

        return topicLink
      } catch {
        throw new Error(`No such topic link with ID ${input.id}`)
      }
    },
  ),

  create: protectedProcedure.feedbackTopicCategoryTopic.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("feedback_topic_category_topic")
          .values(input)
          .executeTakeFirstOrThrow()

        return await context.db
          .selectFrom("feedback_topic_category_topic")
          .innerJoin(
            "feedback_topic",
            "feedback_topic.id",
            "feedback_topic_category_topic.feedback_topic_id",
          )
          .innerJoin(
            "feedback_topic_category",
            "feedback_topic_category.id",
            "feedback_topic_category_topic.feedback_topic_category_id",
          )
          .select([
            "feedback_topic_category_topic.id",
            "feedback_topic.title as feedback_topic",
            "feedback_topic_category.title as feedback_topic_category",
          ])
          .where("feedback_topic_category_topic.id", "=", Number(insertId))
          .executeTakeFirstOrThrow()
      } catch {
        throw new Error("Error on create new topic link")
      }
    },
  ),

  update: protectedProcedure.feedbackTopicCategoryTopic.update.handler(
    async ({ context, input }) => {
      try {
        await context.db
          .updateTable("feedback_topic_category_topic")
          .set(input.body)
          .where("id", "=", +input.params.id)
          .execute()

        return await context.db
          .selectFrom("feedback_topic_category_topic")
          .innerJoin(
            "feedback_topic",
            "feedback_topic.id",
            "feedback_topic_category_topic.feedback_topic_id",
          )
          .innerJoin(
            "feedback_topic_category",
            "feedback_topic_category.id",
            "feedback_topic_category_topic.feedback_topic_category_id",
          )
          .select([
            "feedback_topic_category_topic.id",
            "feedback_topic.title as feedback_topic",
            "feedback_topic_category.title as feedback_topic_category",
          ])
          .where("feedback_topic_category_topic.id", "=", +input.params.id)
          .executeTakeFirstOrThrow()
      } catch {
        throw new Error(`Error on update topic link with ID ${input.params.id}`)
      }
    },
  ),

  delete: protectedProcedure.feedbackTopicCategoryTopic.delete.handler(
    async ({ context, input }) => {
      try {
        await context.db
          .deleteFrom("feedback_topic_category_topic")
          .where("id", "=", +input.id)
          .execute()

        return { success: true }
      } catch {
        throw new Error(`Error on delete topic link with ID ${input.id}`)
      }
    },
  ),
}

export default feedbackTopicCategoryTopicRouter
