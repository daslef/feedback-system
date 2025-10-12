import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const deleteOfficialResponsibility =
  protectedProcedure.officialResponsibility.delete.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .deleteFrom("official_responsibility")
          .where("official_responsibility.id", "=", Number(input.params.id))
          .executeTakeFirstOrThrow();
        return { status: "ok" };
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при удалении пары с ID ${input.params.id}`,
        });
      }
    },
  );

export default deleteOfficialResponsibility;
