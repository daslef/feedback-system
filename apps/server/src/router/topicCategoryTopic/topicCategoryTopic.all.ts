import { publicProcedure } from "@shared/api";
import { type Database } from "@shared/database";

const allTopicCategoryTopics = publicProcedure.topicCategoryTopic.all.handler(
  async ({ context, input, errors }) => {
    try {
      const { filter, sort, limit, offset } = input;

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
          "topic_category_topic.topic_id",
          "topic_category_topic.topic_category_id",
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
          } else if (operator === "in" && typeof value === "number") {
            value = Array.isArray(value) ? value : [value];
          }

          query = query.where(
            column,
            mapOperatorsToSql[operator],
            value as number | number[],
          );
        }
      }

      if (sort !== undefined) {
        for (const sortExpression of sort) {
          let [field, order] = sortExpression.split(".");
          if (field === "topic_id") {
            query = query.orderBy("topic.title", order as "desc" | "asc");
          }
          if (field === "topic_category_id") {
            query = query.orderBy(
              "topic_category.title",
              order as "desc" | "asc",
            );
          }
        }
      }

      const total = (await query.execute()).length;
      context.resHeaders?.set("x-total-count", String(total));

      if (limit !== undefined) {
        query = query.limit(limit);
      }

      if (offset !== undefined) {
        query = query.offset(offset);
      }

      return await query.execute();
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allTopicCategoryTopics;
