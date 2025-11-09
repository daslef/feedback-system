import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const oneVotingVote = protectedProcedure.votingVote.one.handler(
  async ({ context, input, errors }) => {
    try {
      return await _baseSelect(context.db)
        .where("voting_vote.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено голоса с ID ${input.id}`,
      });
    }
  },
);

export default oneVotingVote;
