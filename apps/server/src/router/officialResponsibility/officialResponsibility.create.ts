import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createOfficialResponsibility =
  protectedProcedure.officialResponsibility.create.handler(
    async ({ context, input, errors }) => {
      try {
        let officialResponsibilityId;
        if (context.environment === "development") {
          const { insertId } = await context.db
            .insertInto("official_responsibility")
            .values(input)
            .executeTakeFirstOrThrow();
          officialResponsibilityId = insertId;
        } else {
          const { id } = await context.db
            .insertInto("official_responsibility")
            .values(input)
            .returning("id")
            .executeTakeFirstOrThrow();
          officialResponsibilityId = id;
        }

        return await _baseSelect(context.db)
          .where(
            "official_responsibility.id",
            "=",
            Number(officialResponsibilityId),
          )
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании новой пары",
        });
      }
    },
  );

export default createOfficialResponsibility;
