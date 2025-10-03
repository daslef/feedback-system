import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const updateOfficialResponsibility =
  protectedProcedure.officialResponsibility.update.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .updateTable("official_responsibility")
          .set(input.body)
          .where("official_responsibility.id", "=", +input.params.id)
          .execute();

        return await _baseSelect(context.db)
          .where("official_responsibility.id", "=", +input.params.id)
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при обновлении пары с ID ${input.params.id}`,
        });
      }
    },
  );

export default updateOfficialResponsibility;
