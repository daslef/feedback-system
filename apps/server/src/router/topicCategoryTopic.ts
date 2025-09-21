import { publicProcedure } from "@shared/api";

const topicCategoryTopicRouter = {
  all: publicProcedure.topicCategoryTopic.all.handler(
    async ({ context, input }) => {
      const { filter, filter_by, field_id } = input;

      let query = context.db
        .selectFrom("topic_category_topic")
        .innerJoin("topic", "topic.id", "topic_category_topic.topic_id")
        .innerJoin(
          "topic_category",
          "topic_category.id",
          "topic_category_topic.topic_category_id",
        )
        .select([
          "topic_category_topic.id",
          "topic.title as topic",
          "topic_category.title as topic_category",
        ]);

      if (filter_by && field_id) {
        const whereCondition =
          filter_by === "category"
            ? "topic_category_topic.topic_category_id"
            : "topic_category_topic.topic_id";

        query = query.where(whereCondition, "=", +field_id);
      }

      return await query.execute();
    },
  ),

  create: publicProcedure.topicCategoryTopic.create.handler(
    async ({ context, input }) => {
      const { topic_category_id, topic_id } = input;
      const { insertId } = await context.db
        .insertInto("topic_category_topic")
        .values({
          topic_category_id,
          topic_id,
        })
        .executeTakeFirstOrThrow();

      return await context.db
        .selectFrom("topic_category_topic")
        .innerJoin("topic", "topic.id", "topic_category_topic.topic_id")
        .innerJoin(
          "topic_category",
          "topic_category.id",
          "topic_category_topic.topic_category_id",
        )
        .select([
          "topic_category_topic.id",
          "topic.title as topic",
          "topic_category.title as topic_category",
        ])
        .where("topic_category_topic.id", "=", Number(insertId))
        .executeTakeFirstOrThrow();
    },
  ),
};

export default topicCategoryTopicRouter;
