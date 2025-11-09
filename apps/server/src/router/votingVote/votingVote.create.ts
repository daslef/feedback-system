import { publicProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createVotingVote =
  publicProcedure.votingVote.create.handler(
    async ({ context, input, errors }) => {
      try {
        let unitId;

        if (context.environment.ENV === "development") {
          const { insertId } = await context.db
            .insertInto("voting_vote")
            .values(input)
            .executeTakeFirstOrThrow();
          unitId = insertId;
        } else {
          const { id } = await context.db
            .insertInto("voting_vote")
            .values(input)
            .returning("id")
            .executeTakeFirstOrThrow();
          unitId = id;
        }

        return await _baseSelect(context.db)
          .where("voting_vote.id", "=", Number(unitId))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({
          message: "Ошибка при создании нового голоса",
        });
      }
    },
  );

export default createVotingVote;
