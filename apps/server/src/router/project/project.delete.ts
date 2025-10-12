import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const deleteProject = protectedProcedure.project.delete.handler(
  async ({ context, input, errors }) => {
    try {
      await context.db
        .deleteFrom("project")
        .where("project.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
      return { status: "ok" };
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: `Ошибка при удалении проекта с ID ${input.id}`,
      });
    }
  },
);

export default deleteProject;
