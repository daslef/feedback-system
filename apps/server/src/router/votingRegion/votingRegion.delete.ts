import { protectedProcedure } from "@shared/api";

const deleteVotingRegion =
  protectedProcedure.votingRegion.delete.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .deleteFrom("voting_region")
          .where("voting_region.id", "=", Number(input.id))
          .executeTakeFirstOrThrow();
        return { status: "ok" };
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при удалении региона с ID ${input.id}`,
        });
      }
    },
  );

export default deleteVotingRegion;
