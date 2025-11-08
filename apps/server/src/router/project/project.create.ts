import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createProject = protectedProcedure.project.create.handler(
  async ({ context, input, errors }) => {
    try {
      let projectId;

      if (context.environment.ENV === "development") {
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
);

export default createProject;
