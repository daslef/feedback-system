import { publicProcedure, protectedProcedure } from "@shared/api";

const projectRouter = {
  all: publicProcedure.project.all.handler(async ({ context, input }) => {
    // TODO pagination by limit, offset
    const { offset, limit } = input;

    const projects = await context.db
      .selectFrom("project")
      .selectAll()
      .execute();
    return projects;
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
