import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const updateProject = protectedProcedure.project.update.handler(
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
);

export default updateProject;
