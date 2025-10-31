import { protectedProcedure } from "@shared/api";

const createTopicCategoryTopic =
  protectedProcedure.topicCategoryTopic.create.handler(
    async ({ context, input, errors }) => {
      try {
        const { topic_category_id, topic_id } = input;

        const tctValues = {
          topic_category_id,
          topic_id,
        };

        let tctId;
        if (context.environment.ENV === "development") {
          const { insertId } = await context.db
            .insertInto("topic_category_topic")
            .values(tctValues)
            .executeTakeFirstOrThrow();
          tctId = insertId;
        } else {
          const { id } = await context.db
            .insertInto("topic_category_topic")
            .values(tctValues)
            .returning("id")
            .executeTakeFirstOrThrow();
          tctId = id;
        }

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
            "topic_category_topic.topic_id",
            "topic_category_topic.topic_category_id",
            "topic.title as topic",
            "topic_category.title as topic_category",
          ])
          .where("topic_category_topic.id", "=", Number(tctId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании новой пары",
        });
      }
    },
  );

export default createTopicCategoryTopic;
