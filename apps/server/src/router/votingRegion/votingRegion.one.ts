import { protectedProcedure } from "@shared/api";

const oneVotingRegion = protectedProcedure.votingRegion.one.handler(
  async ({ context, input, errors }) => {
    try {
      return await context.db
        .selectFrom("voting_region")
        .selectAll()
        .where("voting_region.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено региона с ID ${input.id}`,
      });
    }
  },
);

export default oneVotingRegion;
