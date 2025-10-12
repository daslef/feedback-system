import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const deletePerson = protectedProcedure.person.delete.handler(
  async ({ context, input, errors }) => {
    try {
      await context.db
        .deleteFrom("person")
        .where("person.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
      return { status: "ok" };
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({
        message: `Ошибка при удалении пользователя с ID ${input.id}`,
      });
    }
  },
);

export default deletePerson;
