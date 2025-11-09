import { protectedProcedure } from "@shared/api";

const deleteVotingVote =
  protectedProcedure.votingVote.delete.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .deleteFrom("voting_vote")
          .where("voting_vote.id", "=", Number(input.id))
          .executeTakeFirstOrThrow();
        return { status: "ok" };
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при удалении голоса с ID ${input.id}`,
        });
      }
    },
  );

export default deleteVotingVote;
