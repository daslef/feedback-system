import { publicProcedure, protectedProcedure } from "@shared/api";
import { type Database } from "@shared/database";

const administrativeUnitRouter = {
  all: publicProcedure.administrativeUnit.all.handler(
    async ({ context, input, errors }) => {
      try {
        const { offset, limit, filter, sort } = input;

        let query = context.db
          .selectFrom("administrative_unit")
          .innerJoin(
            "administrative_unit_type",
            "administrative_unit_type.id",
            "administrative_unit.unit_type_id",
          )
          .select([
            "administrative_unit.id as id",
            "administrative_unit.title as title",
            "administrative_unit.unit_type_id as unit_type_id",
            "administrative_unit_type.title as unit_type",
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
              | keyof Database["administrative_unit"]
              | keyof Database["administrative_unit_type"];

            if (column === "id") {
              column =
                "administrative_unit.id" as keyof Database["administrative_unit"];
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

        context.resHeaders?.set(
          "x-total-count",
          String((await query.execute()).length),
        );

        if (sort !== undefined) {
          for (const sortExpression of sort) {
            const [field, order] = sortExpression.split(".");
            query = query.orderBy(
              field as keyof Database["administrative_unit"],
              order as "desc" | "asc",
            );
          }
        } else {
          query = query.orderBy("administrative_unit.title", "asc");
        }

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
  ),

  create: protectedProcedure.administrativeUnit.create.handler(
    async ({ context, input, errors }) => {
      try {
        const { insertId } = await context.db
          .insertInto("administrative_unit")
          .values(input)
          .executeTakeFirstOrThrow();

        return await context.db
          .selectFrom("administrative_unit")
          .innerJoin(
            "administrative_unit_type",
            "administrative_unit.id",
            "administrative_unit_type.id",
          )
          .select([
            "administrative_unit.id",
            "administrative_unit.title",
            "administrative_unit.unit_type_id",
            "administrative_unit_type.title as unit_type",
          ])
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового поселения",
        });
      }
    },
  ),
};

export default administrativeUnitRouter;
