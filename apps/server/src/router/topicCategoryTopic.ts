import { publicProcedure } from "@shared/api";
import { type Database } from "@shared/database";

const topicCategoryTopicRouter = {
  all: publicProcedure.topicCategoryTopic.all.handler(
    async ({ context, input, errors }) => {
      try {
        const { filter } = input;

        let query = context.db
          .selectFrom("topic_category_topic")
          .innerJoin("topic", "topic.id", "topic_category_topic.topic_id")
          .innerJoin(
            "topic_category",
            "topic_category.id",
            "topic_category_topic.topic_category_id",
          )
          .select([
            "topic_category_topic.id as id",
            "topic.title as topic",
            "topic_category.title as topic_category",
          ]);

        if (filter?.length) {
          const mapOperatorsToSql = {
            eq: "=",
            ne: "!=",
            lt: "<",
            gt: ">",
            in: "in",
          } as const;

          type WhereValue = string | number | string[] | number[];

          for (const filterExpression of filter) {
            const matchResult =
              decodeURI(filterExpression).match(/(.*)\[(.*)\](.*)/);

            if (matchResult === null) {
              continue;
            }

            let column = matchResult[1] as
              | keyof Database["topic_category_topic"]
              | keyof Database["topic"]
              | keyof Database["topic_category"];

            if (column === "id") {
              column =
                "topic_category_topic.id" as keyof Database["topic_category_topic"];
            }

            const operator = matchResult[2] as keyof typeof mapOperatorsToSql;

            let value: WhereValue = Number.isFinite(+matchResult[3])
              ? +matchResult[3]
              : matchResult[3];

            if (operator === "in" && typeof value === "string") {
              const items = value.split(",");
              value = items.some((item) => !Number.isFinite(+item))
                ? items
                : items.map(Number);
            }

            query = query.where(
              column,
              mapOperatorsToSql[operator],
              value as number | number[],
            );
          }
        }

        return await query.execute();
      } catch (error) {
        console.error(error);
        throw errors.INTERNAL_SERVER_ERROR();
      }
    },
  ),

  create: publicProcedure.topicCategoryTopic.create.handler(
    async ({ context, input, errors }) => {
      try {
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
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании новой пары",
        });
      }
    },
  ),
};

export default topicCategoryTopicRouter;
