import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";
import { type Database } from "@shared/database";

const allOfficialResponsibilities =
  protectedProcedure.officialResponsibility.all.handler(
    async ({ context, input, errors }) => {
      try {
        const { filter, sort, offset, limit } = input;

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
              | keyof Database["official_responsibility"]
              | keyof Database["administrative_unit"]
              | keyof Database["person"];

            if (column === "id") {
              column =
                "official_responsibility.id" as keyof Database["official_responsibility"];
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
            if (field === "official_id") {
              query = query
                .orderBy("person.last_name", order as "desc" | "asc")
                .orderBy("person.first_name", order as "desc" | "asc");
            }
            if (field === "administrative_unit_id") {
              query = query.orderBy(
                "administrative_unit.title",
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

export default allOfficialResponsibilities;
