import { publicProcedure, protectedProcedure } from "@shared/api";
import type { Database } from "@shared/database";

const projectRouter = {
  all: publicProcedure.project.all.handler(async ({ context, input }) => {
    const { offset, limit, sort, filter, administrative_unit_type } = input;

    try {
      let query = context.db
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
        );

      if (administrative_unit_type != undefined) {
        query = query.where(
          "administrative_unit_type.title",
          "=",
          administrative_unit_type,
        );
      }

      query = query.select([
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

      return await query.execute();
    } catch (error) {
      console.error(error);
    }
  }),

  update: publicProcedure.project.update.handler(async ({ context, input }) => {
    try {
      await context.db
        .updateTable("project")
        .set(input.body)
        .where("project.id", "=", +input.params.id)
        .execute();

      return await context.db
        .selectFrom("project")
        .selectAll("project")
        .innerJoin(
          "administrative_unit",
          "project.administrative_unit_id",
          "administrative_unit.id",
        )
        .select(["administrative_unit.title as administrative_unit"])
        .where("project.id", "=", +input.params.id)
        .executeTakeFirstOrThrow();
    } catch {
      throw new Error(`Error on update project with ID ${input.params.id}`);
    }
  }),

  one: publicProcedure.project.one.handler(async ({ context, input }) => {
    try {
      const project = await context.db
        .selectFrom("project")
        .innerJoin(
          "administrative_unit",
          "project.administrative_unit_id",
          "administrative_unit.id",
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
          "administrative_unit_type.title as administrative_unit_type",
          "administrative_unit.title as administrative_unit",
          "project.created_at",
        ])
        .where("project.id", "=", +input.id)
        .executeTakeFirstOrThrow();

      console.log(project);

      return project;
    } catch (error) {
      console.log(error);
      throw new Error(`No such project with ID ${input.id}`);
    }
  }),

  create: protectedProcedure.project.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("project")
          .values(input)
          .executeTakeFirstOrThrow();

        return await context.db
          .selectFrom("project")
          .innerJoin(
            "administrative_unit",
            "project.administrative_unit_id",
            "administrative_unit.id",
          )
          .selectAll("project")
          .select("administrative_unit.title as administrative_unit")
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch {
        throw new Error("Error on create new project");
      }
    },
  ),
};

export default projectRouter;
