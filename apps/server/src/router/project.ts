import { publicProcedure, protectedProcedure } from "@shared/api";

const projectRouter = {
  all: publicProcedure.project.all.handler(async ({ context, input }) => {
    const { offset, limit, administrative_unit_type } = input;

    let query = context.db.selectFrom("project");

    if (administrative_unit_type) {
      return await query
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
        .where("administrative_unit_type.title", "=", administrative_unit_type)
        .select([
          "project.id",
          "project.title",
          "project.latitude",
          "project.longitude",
          "project.year_of_completion",
          "project.administrative_unit_id",
          "project.created_at",
        ])
        .execute();
    }

    return await query
      .select([
        "project.id",
        "project.title",
        "project.latitude",
        "project.longitude",
        "project.year_of_completion",
        "project.administrative_unit_id",
        "project.created_at",
      ])
      .limit(limit!)
      .offset(offset!)
      .execute();
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
        .selectAll("project")
        .innerJoin(
          "administrative_unit",
          "project.administrative_unit_id",
          "administrative_unit.id",
        )
        .select(["administrative_unit.title as administrative_unit"])
        .where("project.id", "=", +input.id)
        .executeTakeFirstOrThrow();

      return project;
    } catch {
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
