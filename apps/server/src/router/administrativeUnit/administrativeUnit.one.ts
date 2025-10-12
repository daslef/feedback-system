import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const oneAdministrativeUnit = protectedProcedure.administrativeUnit.one.handler(
  async ({ context, input, errors }) => {
    try {
      return await _baseSelect(context.db)
        .where("administrative_unit.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено записи с ID ${input.id}`,
      });
    }
  },
);

export default oneAdministrativeUnit;
