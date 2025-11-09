import { protectedProcedure } from "@shared/api";

const createVotingRegion =
  protectedProcedure.votingRegion.create.handler(
    async ({ context, input, errors }) => {
      try {
        let unitId;

        if (context.environment.ENV === "development") {
          const { insertId } = await context.db
            .insertInto("voting_region")
            .values(input)
            .executeTakeFirstOrThrow();
          unitId = insertId;
        } else {
          const { id } = await context.db
            .insertInto("voting_region")
            .values(input)
            .returning("id")
            .executeTakeFirstOrThrow();
          unitId = id;
        }

        return await context.db
          .selectFrom("voting_region")
          .selectAll()
          .where("voting_region.id", "=", Number(unitId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового региона",
        });
      }
    },
  );

export default createVotingRegion;
