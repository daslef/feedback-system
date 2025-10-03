import { publicProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const oneProject = publicProcedure.project.one.handler(
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
);

export default oneProject;
