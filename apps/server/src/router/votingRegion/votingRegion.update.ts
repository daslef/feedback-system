import { protectedProcedure } from "@shared/api";

const updateVotingRegion =
  protectedProcedure.votingRegion.update.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .updateTable("voting_region")
          .set(input.body)
          .where("voting_region.id", "=", +input.params.id)
          .execute();

        return await context.db
          .selectFrom("voting_region")
          .selectAll()
          .where("voting_region.id", "=", +input.params.id)
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при обновлении региона с ID ${input.params.id}`,
        });
      }
    },
  );

export default updateVotingRegion;
