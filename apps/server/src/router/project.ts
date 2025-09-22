import { publicProcedure, protectedProcedure } from "@shared/api";
import { db } from "@shared/database";
import type { Database } from "@shared/database";

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
      const { offset, limit, sort, filter, administrative_unit_type } = input;

      try {
        let query = _baseSelect(context.db);

        if (filter !== undefined) {
          const mapOperatorsToSql = {
            eq: "=",
            ne: "!=",
            lt: ">",
            gt: "<",
          } as const;

          type ConvertedFilter = {
            field: keyof Database["project"];
            operator: keyof typeof mapOperatorsToSql;
            value: string | number;
          };

          for (const filterExpression of filter) {
            const matchResult = filterExpression.match(/(.*)\[(.*)\](.*)/);

            if (matchResult === null) {
              continue;
            }

            const convertedFilter = {
              field: matchResult[1],
              operator: matchResult[2],
              value: matchResult[3],
            } as ConvertedFilter;

            query = query.where(
              convertedFilter.field,
              mapOperatorsToSql[convertedFilter.operator],
              convertedFilter.value,
            );
          }
        }

        if (administrative_unit_type != undefined) {
          query = query.where(
            "administrative_unit_type.title",
            "=",
            administrative_unit_type,
          );
        }

        const total = (await query.execute()).length;
        context.resHeaders?.set("x-total-count", String(total));

        if (limit !== undefined) {
          query = query.limit(limit);
        }

        if (offset !== undefined) {
          query = query.offset(offset);
        }

        if (sort !== undefined) {
          for (const sortExpression of sort) {
            const [field, order] = sortExpression.split(".");
            query = query.orderBy(
              field as keyof Database["project"],
              order as "desc" | "asc",
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
          message: `Error on update project with ID ${input.params.id}`,
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
        const { insertId } = await context.db
          .insertInto("project")
          .values(input)
          .executeTakeFirstOrThrow();

        return await _baseSelect(context.db)
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового проекта",
        });
      }
    },
  ),
};

export default projectRouter;
