import { protectedProcedure } from "@shared/api";
import { type Database } from "@shared/database";
import _baseSelect from "./_baseSelect";

const allFeedback = protectedProcedure.feedback.all.handler(
  async ({ context, input, errors }) => {
    try {
      const { offset, limit, sort, filter } = input;

      let query = _baseSelect(context.db);

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
            | keyof Database["feedback"]
            | keyof Database["topic"]
            | keyof Database["project"]
            | keyof Database["feedback_status"]
            | keyof Database["feedback_type"];

          if (column === "id") {
            column = "feedback.id" as keyof Database["feedback"];
          }

          if (column === "feedback_status_id") {
            column =
              "feedback.feedback_status_id" as keyof Database["feedback"];
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

          query = query.where(column, mapOperatorsToSql[operator], value);
        }
      }

      if (sort !== undefined) {
        for (const sortExpression of sort) {
          let [field, order] = sortExpression.split(".");

          if (field === "created_at") {
            field = "feedback.created_at";
          }

          query = query.orderBy(
            field as keyof Database["feedback"],
            order as "desc" | "asc",
          );
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

      const results = await query.execute();

      return results.map((result) => ({
        ...result,
        created_at: new Date(result.created_at).toISOString(),
      }));
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allFeedback;
