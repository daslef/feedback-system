import { publicProcedure } from "@shared/api";
import { type Database } from "@shared/database";
import _baseSelect from "./_baseSelect";

const allProjects = publicProcedure.project.all.handler(
  async ({ context, input, errors }) => {
    const { offset, limit, sort, filter } = input;

    try {
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
            | keyof Database["project"]
            | keyof Database["administrative_unit"]
            | keyof Database["administrative_unit_type"];

          if (["id", "title"].includes(column)) {
            column = `project.${column}` as keyof Database["project"];
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
          if (["id", "title"].includes(field)) {
            field = `project.${field}`;
          }
          query = query.orderBy(
            field as keyof Database["project"],
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

      return await query.execute();
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allProjects;
