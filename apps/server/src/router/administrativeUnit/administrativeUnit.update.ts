import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const updateAdministrativeUnit =
  protectedProcedure.administrativeUnit.update.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .updateTable("administrative_unit")
          .set(input.body)
          .where("administrative_unit.id", "=", +input.params.id)
          .execute();

        return await _baseSelect(context.db)
          .where("administrative_unit.id", "=", +input.params.id)
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при обновлении проекта с ID ${input.params.id}`,
        });
      }
    },
  );

export default updateAdministrativeUnit;
