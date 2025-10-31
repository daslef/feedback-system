import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createAdministrativeUnit =
  protectedProcedure.administrativeUnit.create.handler(
    async ({ context, input, errors }) => {
      try {
        let unitId;

        if (context.environment.ENV === "development") {
          const { insertId } = await context.db
            .insertInto("administrative_unit")
            .values(input)
            .executeTakeFirstOrThrow();
          unitId = insertId;
        } else {
          const { id } = await context.db
            .insertInto("administrative_unit")
            .values(input)
            .returning("id")
            .executeTakeFirstOrThrow();
          unitId = id;
        }

        return await _baseSelect(context.db)
          .where("administrative_unit.id", "=", Number(unitId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового поселения",
        });
      }
    },
  );

export default createAdministrativeUnit;
