import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const updateVotingUnit =
  protectedProcedure.votingUnit.update.handler(
    async ({ context, input, errors }) => {
      try {
        await context.db
          .updateTable("voting_unit")
          .set(input.body)
          .where("voting_unit.id", "=", +input.params.id)
          .execute();

        return await _baseSelect(context.db)
          .where("voting_unit.id", "=", +input.params.id)
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: `Ошибка при обновлении региона с ID ${input.params.id}`,
        });
      }
    },
  );

export default updateVotingUnit;
