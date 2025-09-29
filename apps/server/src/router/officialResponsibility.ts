import { protectedProcedure } from "@shared/api";
import { type Database, db } from "@shared/database";

function _baseSelect(dbInstance: typeof db) {
  return dbInstance
    .selectFrom("official_responsibility")
    .innerJoin(
      "administrative_unit",
      "administrative_unit.id",
      "official_responsibility.administrative_unit_id",
    )
    .innerJoin("person", "person.id", "official_responsibility.official_id")
    .select([
      "official_responsibility.id as id",
      "official_responsibility.official_id as official_id",
      "official_responsibility.administrative_unit_id as administrative_unit_id",
      "administrative_unit.title as administrative_unit",
      "person.first_name as official_first_name",
      "person.last_name as official_last_name",
      "person.middle_name as as official_middle_name",
    ]);
}

const officialResponsibilityRouter = {
  all: protectedProcedure.officialResponsibility.all.handler(
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
  ),

  create: protectedProcedure.officialResponsibility.create.handler(
    async ({ context, input, errors }) => {
      try {
        let officialResponsibilityId;
        if (context.environment === "development") {
          const { insertId } = await context.db
            .insertInto("official_responsibility")
            .values(input)
            .executeTakeFirstOrThrow();
          officialResponsibilityId = insertId;
        } else {
          const { id } = await context.db
            .insertInto("official_responsibility")
            .values(input)
            .returning("id")
            .executeTakeFirstOrThrow();
          officialResponsibilityId = id;
        }

        return await _baseSelect(context.db)
          .where(
            "official_responsibility.id",
            "=",
            Number(officialResponsibilityId),
          )
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании новой пары",
        });
      }
    },
  ),

  update: protectedProcedure.officialResponsibility.update.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .updateTable("official_responsibility")
          .set(input.body)
          .where("official_responsibility.id", "=", +input.params.id)
          .execute();

        return await _baseSelect(context.db)
          .where("official_responsibility.id", "=", +input.params.id)
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при обновлении пары с ID ${input.params.id}`,
        });
      }
    },
  ),

  delete: protectedProcedure.project.delete.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .deleteFrom("official_responsibility")
          .where("official_responsibility.id", "=", Number(input.id))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при удалении пары с ID ${input.id}`,
        });
      }
    },
  ),
};

export default officialResponsibilityRouter;
