import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const oneVotingUnit = protectedProcedure.votingUnit.one.handler(
  async ({ context, input, errors }) => {
    try {
      return await _baseSelect(context.db)
        .where("voting_unit.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено региона с ID ${input.id}`,
      });
    }
  },
);

export default oneVotingUnit;
