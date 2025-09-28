import { publicProcedure, protectedProcedure } from "@shared/api";
import { db, type Database } from "@shared/database";

const _baseSelect = (dbInstance: typeof db) => {
  return dbInstance
    .selectFrom("project")
    .innerJoin(
      "administrative_unit",
      "administrative_unit.id",
      "project.administrative_unit_id",
    )
    .innerJoin(
      "administrative_unit_type",
      "administrative_unit_type.id",
      "administrative_unit.unit_type_id",
    )
    .select([
      "project.id",
      "project.title as title",
      "project.latitude",
      "project.longitude",
      "project.year_of_completion",
      "project.administrative_unit_id",
      "administrative_unit.title as administrative_unit",
      "administrative_unit_type.title as administrative_unit_type",
      "project.created_at",
    ]);
};

const projectRouter = {
  all: publicProcedure.project.all.handler(
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
  ),

  update: publicProcedure.project.update.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .updateTable("project")
          .set(input.body)
          .where("project.id", "=", +input.params.id)
          .execute();

        return await _baseSelect(context.db)
          .where("project.id", "=", +input.params.id)
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при обновлении проекта с ID ${input.params.id}`,
        });
      }
    },
  ),

  one: publicProcedure.project.one.handler(
    async ({ context, input, errors }) => {
      try {
        const project = await _baseSelect(context.db)
          .where("project.id", "=", +input.id)
          .executeTakeFirstOrThrow();

        return project;
      } catch (error) {
        console.error(error);
        throw errors.NOT_FOUND({
          message: `Проект с ID ${input.id} не найден`,
        });
      }
    },
  ),

  create: protectedProcedure.project.create.handler(
    async ({ context, input, errors }) => {
      try {
        let projectId;

        if (context.environment === "development") {
          const { insertId } = await context.db
            .insertInto("project")
            .values(input)
            .executeTakeFirstOrThrow();
          projectId = insertId;
        } else {
          const { id } = await context.db
            .insertInto("project")
            .values(input)
            .returning("id")
            .executeTakeFirstOrThrow();
          projectId = id;
        }

        return await _baseSelect(context.db)
          .where("project.id", "=", Number(projectId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового проекта",
        });
      }
    },
  ),

  delete: protectedProcedure.project.delete.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .deleteFrom("project")
          .where("project.id", "=", Number(input.id))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при удалении проекта с ID ${input.id}`,
        });
      }
    },
  ),
};

export default projectRouter;
